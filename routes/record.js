/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

var express = require("express");
var router = express.Router();
const { Gateway, FileSystemWallet } = require("fabric-network");
const path = require("path");

/* GET query listing. */
router.post("/createdoctor", async function(req, res, next) {
  const id = req.body.id;
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-org1.json"
    );
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
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
        message: `An identity for the user ${userId} does not exist in the wallet`
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

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.submitTransaction("createDoctorRecord");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    await gateway.disconnect();
    res.json({
      status: "success",
      message: `create patient successful`
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.post("/createpatient", async function(req, res, next) {
  const id = req.body.id;
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-org1.json"
    );
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
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
        message: `An identity for the user ${userId} does not exist in the wallet`
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

    const result = await contract.submitTransaction("createPatientRecord");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    await gateway.disconnect();
    res.json({
      status: "success",
      message: `create patient successful`
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.put("/addmedicalinfo", async function(req, res, next) {
  const { id, patientID, info } = res.body;
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-org1.json"
    );
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
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
        message: `An identity for the user ${userId} does not exist in the wallet`
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
      "writePatientRecord",
      patientID,
      info
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    await gateway.disconnect();
    res.json({
      status: "success",
      message: `create patient successful`
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: `Failed to submit transaction: ${error}`
    });
  }
});
router.get("/getmedicalinfo", async function(req, res, next) {
  const { id, patientID } = res.query;
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-org1.json"
    );
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
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
    let result;
    if (patientID) {
      result = await contract.evaluateTransaction(
        "getMedicalInfoByPatientId",
        patientID
      );
    } else {
      result = await contract.evaluateTransaction("getMyMedicalInfo");
    }
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.json({
      status: "success",
      data: JSON.parse(result)
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.json({
      result: "failed",
      message: `Failed to evaluate transaction: ${error}`
    });
    process.exit(1);
  }
});

module.exports = router;
