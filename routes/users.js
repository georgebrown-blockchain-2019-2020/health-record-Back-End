var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.post("/registerClient", async (req, res) => {
  let { userId } = req.body;
  const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin
  } = require("fabric-network");
  const path = require("path");

  const ccpPath = path.resolve(__dirname, "config", "connection-org1.json");
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userId);
    if (userExists) {
      res.json({
        result: "failed",
        message: `An identity for the user ${userId} already exists in the wallet`
      });
    }
    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists("admin");
    if (!adminExists) {
      res.json({
        result: "failed",
        message: `An identity for the admin user "admin" does not exist in the wallet. Run the enrollAdmin.js application before retrying`
      });
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      { affiliation: "org1.department1", enrollmentID: userId, role: "client" },
      adminIdentity
    );
    const enrollment = await ca.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret
    });
    const userIdentity = X509WalletMixin.createIdentity(
      "Org1MSP",
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import(userId, userIdentity);
    console.log(
      'Successfully registered and enrolled admin user "user2" and imported it into the wallet'
    );
    res.json({
      result: "ok",
      message: `Successfully registered and enrolled admin user ${userId} and imported it into the wallet`
    });
  } catch (error) {
    console.error(`Failed to register user "user2": ${error}`);
    res.json({
      result: "fail",
      message: `Failed to register user ${userId}: ${error}`
    });
    process.exit(1);
  }
});
router.post("/registerDoctor", async (req, res) => {
  let { userId } = req.body;
  const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin
  } = require("fabric-network");
  const path = require("path");

  const ccpPath = path.resolve(__dirname, "config", "connection-org1.json");
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userId);
    if (userExists) {
      res.json({
        result: "failed",
        message: `An identity for the user ${userId} already exists in the wallet`
      });
    }
    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists("admin");
    if (!adminExists) {
      res.json({
        result: "failed",
        message: `An identity for the admin user "admin" does not exist in the wallet. Run the enrollAdmin.js application before retrying`
      });
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      { affiliation: "org1.department1", enrollmentID: userId, role: "doctor" },
      adminIdentity
    );
    const enrollment = await ca.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret
    });
    const userIdentity = X509WalletMixin.createIdentity(
      "Org1MSP",
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import(userId, userIdentity);
    console.log(
      'Successfully registered and enrolled admin user "user2" and imported it into the wallet'
    );
    res.json({
      result: "ok",
      message: `Successfully registered and enrolled admin user ${userId} and imported it into the wallet`
    });
  } catch (error) {
    console.error(`Failed to register user "user2": ${error}`);
    res.json({
      result: "fail",
      message: `Failed to register user ${userId}: ${error}`
    });
    process.exit(1);
  }
});
module.exports = router;
