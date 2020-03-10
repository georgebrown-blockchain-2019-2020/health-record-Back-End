var express = require("express");
var router = express.Router();

const {
  FileSystemWallet,
  Gateway,
  X509WalletMixin
} = require("fabric-network");
const path = require("path");

const ccpPath = path.resolve(__dirname, "..", "config", "connection-org1.json");
const walletPath = path.join(process.cwd(), "wallet");
const wallet = new FileSystemWallet(walletPath);
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.post("/registerClient", async (req, res) => {
  let { userId } = req.body;

  try {
    // Create a new file system based wallet for managing identities.

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
      {
        affiliation: "org1.department1",
        enrollmentID: userId,
        role: "client",
        attrs: [{ name: "role", value: "client", ecert: true }]
      },
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
      result: "failed",
      message: `Failed to register user ${userId}: ${error}`
    });
    process.exit(1);
  }
});
router.post("/registerDoctor", async (req, res) => {
  let { userId } = req.body;
  try {
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
      {
        affiliation: "org1.department1",
        enrollmentID: userId,
        role: "doctor",
        attrs: [{ name: "role", value: "doctor", ecert: true }]
      },
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
      result: "failed",
      message: `Failed to register user ${userId}: ${error}`
    });
    process.exit(1);
  }
});
router.get("/getDoctorList", async (req, res) => {
  const id = req.query.id;
  try {
    // Create a new file system based wallet for managing identities.
    console.log(process.cwd());

    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(id);
    if (!userExists) {
      console.log(`An identity for the user  does not exist in the wallet`);
      console.log("Run the registerUser.js application before retrying");
      res.json({
        result: "failed",
        message: `An identity for the user ${id} does not exist in the wallet`
      });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    // use the identity of user1 from wallet to connect
    await gateway.connect(ccpPath, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("healthrecord");

    const result = await contract.evaluateTransaction("getDoctorList");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.json({
      status: "success",
      data: JSON.parse(result)
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.get("/getAllowedList", async (req, res) => {
  const id = req.query.id;
  try {
    // Create a new file system based wallet for managing identities.
    console.log(process.cwd());

    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(id);
    if (!userExists) {
      console.log(`An identity for the user  does not exist in the wallet`);
      console.log("Run the registerUser.js application before retrying");
      res.json({
        result: "failed",
        message: `An identity for the user ${id} does not exist in the wallet`
      });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    // use the identity of user1 from wallet to connect
    await gateway.connect(ccpPath, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("healthrecord");

    const result = await contract.evaluateTransaction("getAllowedList");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.json({
      status: "success",
      data: JSON.parse(result)
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.get("/getAccessList", async (req, res) => {
  const id = req.query.id;
  try {
    // Create a new file system based wallet for managing identities.
    console.log(process.cwd());

    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(id);
    if (!userExists) {
      console.log(`An identity for the user  does not exist in the wallet`);
      console.log("Run the registerUser.js application before retrying");
      res.json({
        result: "failed",
        message: `An identity for the user ${id} does not exist in the wallet`
      });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    // use the identity of user1 from wallet to connect
    await gateway.connect(ccpPath, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("healthrecord");

    const result = await contract.evaluateTransaction("getAccessList");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.json({
      status: "success",
      data: JSON.parse(result)
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.get("/checkPermissionStatus", async (req, res) => {
  const id = req.query.id;
  try {
    // Create a new file system based wallet for managing identities.
    console.log(process.cwd());

    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(id);
    if (!userExists) {
      console.log(`An identity for the user  does not exist in the wallet`);
      console.log("Run the registerUser.js application before retrying");
      res.json({
        result: "failed",
        message: `An identity for the user ${id} does not exist in the wallet`
      });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    // use the identity of user1 from wallet to connect
    await gateway.connect(ccpPath, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("healthrecord");

    const result = await contract.evaluateTransaction(
      "checkMyPermissionStatus"
    );
    console.log(`Transaction has been evaluated, result is: ${result}`);
    res.json({
      status: "success",
      isAccessed: result
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.delete("/deletePermission", async (req, res) => {
  const { id, permissionedID } = req.body;
  try {
    // Create a new file system based wallet for managing identities.
    console.log(process.cwd());

    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(id);
    if (!userExists) {
      console.log(`An identity for the user  does not exist in the wallet`);
      console.log("Run the registerUser.js application before retrying");
      res.json({
        result: "failed",
        message: `An identity for the user ${id} does not exist in the wallet`
      });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    // use the identity of user1 from wallet to connect
    await gateway.connect(ccpPath, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("healthrecord");

    const result = await contract.submitTransaction(
      "deletePermission",
      permissionedID
    );
    console.log(`Transaction has been evaluated, result is: ${result}`);
    res.json({
      status: "success",
      message: `Deleted user ${permissionedID} successfully`
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
module.exports = router;
