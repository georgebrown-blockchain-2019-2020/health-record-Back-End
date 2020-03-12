# Health Record Back End

Server side for health record project.

## Wallet

Health Record project uses Custodial Wallet

## API Endpoints

All API need to have userID as a parameter order to idetify wallet.
APIs are divided into two main groups : `\users` and `record`

### `\users` APIs

| Endpoint                 | Type   | Request   | Response                                                             | Functionality                                                  |
| ------------------------ | ------ | -------------| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| `\registerClient`        | POST   | `userID`     | {`status`,`message`}                                                 | register user with patient role into wallet                    |
| `\registerDoctor`        | POST   | `userID`     | {`status`,`message`}                                                 | register user with doctor role into wallet                     |
| `\getDoctorList`         | GET    | `id`         | {`status`,`data(doctorList)`} or {`status`,`message`} if have errors | get all doctors                                                |
| `\getAllowedList`        | GET    | `id`    | {`status`,`data(doctorList)`} or {`status`,`message`} if have errors | get list of patients that allow to access                      |
| `\getAccessList`         | GET    | `id`    {`status`,`data(doctorList)`} or {`status`,`message`} if have errors | get list of patients and doctors that can access record        |
| `\checkPermissionStatus` | GET    | `id`,`patientID` | {`status`,`isAccessed`} or {`status`,`message`} if have errors       | check whether having permission to access the patientID or not |
| `\addPermission`         | PUT    | `id`,`permissionedID`,`role` | {`status`,`message`}                                                 | add user with permissionID into accessList                     |
| `\deletePermission`      | DELETE | `id`,`permissionedID` | {`status`,`message`}                                                 | delete user with permissionID from accessList                  |

### `\record` APIs

| Endpoint          | Type | Request                 | Response                                                                      | Functionality                                         |
| ----------------- | ---- | ----------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| `\createpatient`  | POST | `id`                    | {`status`,`message`}                                                          | create a new patient record                           |
| `\createdoctor`   | POST | `id`                    | {`status`,`message`}                                                          | create a new doctor record                            |
| `\addmedicalinfo` | PUT  | `id`,`patientID`,`info` | {`status`,`message`}                                                          | add medical info into patient record (API for doctor) |
| `\getmedicalinfo` | GET  | `id`,`patientID`,       | {`status`,`data(health records list)`} or {`status`,`message`} if have errors | get medical information of patientID or Id            |

## Back-End Build With

- NodeJS: a Javascript runtime.
- ExpressJS: a web application framework for NodeJS in order to create API.
- Fabric Network SDK: create a gate to communicate with Hyperledger Fabric.
- Fabric CA Client SDK: create CA for enrolling system.

## Setup

Install necessary packages.

```
npm install
```

Enroll Admin in order to have permission to allow users create wallet.

```
node enrollAdmin.js
```

## Run server

```
npm start
```
