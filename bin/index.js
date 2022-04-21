#!/usr/bin/env node

// read in env settings
//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const yargs = require('yargs');
const axios = require('axios');

const fetch = require('./fetch');
const auth = require('./auth');


const app = express();
app.use(express.json());
app.use(cors());

app.get('/getdoc', async (req, res) => {
    const authResponse = await auth.getToken(auth.tokenRequest);
    const doccontent = await fetch.callApiGet('https://graph.microsoft.com/v1.0/sites/sppartha.sharepoint.com,1ced801a-0616-4143-854d-3bfcd2c44a8a,cccb58fb-6787-45f8-bd7d-328afb251a42/drives/b!GoDtHBYGQ0GFTTv80sRKivtYy8yHZ_hFvX0yivslGkKXSoekIkihRq-OWBfkHkPp/items/017W4NMUYA7OS5KUZH7JG2JYAUM75MH5FK/content', authResponse.accessToken);
    res.contentType("application/pdf");
    res.setHeader("test", "Hello world");
    console.log(res.getHeaders());
    res.send(doccontent);
});

app.get('/previewdoc', async (req, res) => {
    const authResponse = await auth.getToken(auth.tokenRequest);
    const docurl = await fetch.callApiPost('https://graph.microsoft.com/v1.0/sites/sppartha.sharepoint.com,1ced801a-0616-4143-854d-3bfcd2c44a8a,cccb58fb-6787-45f8-bd7d-328afb251a42/drives/b!GoDtHBYGQ0GFTTv80sRKivtYy8yHZ_hFvX0yivslGkKXSoekIkihRq-OWBfkHkPp/items/017W4NMUYA7OS5KUZH7JG2JYAUM75MH5FK/preview', authResponse.accessToken);
    //console.log(authResponse.accessToken);
    res.send(docurl);
});

app.post('/download', async (req, res) => {
    try {
        const byteRange = req.body.range;
        const options = {
            headers: {
                //Range: `bytes=${byteRange}`
            }
        };

        const endpoint = 'https://sppartha.sharepoint.com/_layouts/15/download.aspx?UniqueId=e55d18cb-fd63-4f93-8589-e2f92a05a39c&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvc3BwYXJ0aGEuc2hhcmVwb2ludC5jb21AZmQzYWVjNzgtYzU0My00NzNkLTkzNjktM2E5MDNkNWFiZmIyIiwiaXNzIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIiwibmJmIjoiMTY1MDU2MDc2MCIsImV4cCI6IjE2NTA1NjQzNjAiLCJlbmRwb2ludHVybCI6Ims0ZzNha0xkNkxka0orblNYODFuTm5BbGkxSU1ucGlpOEJnYWZQOFpsY289IiwiZW5kcG9pbnR1cmxMZW5ndGgiOiIxMTkiLCJpc2xvb3BiYWNrIjoiVHJ1ZSIsImNpZCI6Ik1HRXpNVFF6TXpFdE9EQmxOeTFsTURNMExXSmpOamt0T0RFelpHUmtNamhtTldVNSIsInZlciI6Imhhc2hlZHByb29mdG9rZW4iLCJzaXRlaWQiOiJNV05sWkRnd01XRXRNRFl4TmkwME1UUXpMVGcxTkdRdE0ySm1ZMlF5WXpRMFlUaGgiLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBFeHBsb3JlciIsImdpdmVuX25hbWUiOiJQYXJ0aGFzYXJhdGhpIiwiZmFtaWx5X25hbWUiOiJTYWh1IiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJ0aWQiOiJmZDNhZWM3OC1jNTQzLTQ3M2QtOTM2OS0zYTkwM2Q1YWJmYjIiLCJ1cG4iOiJhZG1pbkBzcHBhcnRoYS5vbm1pY3Jvc29mdC5jb20iLCJwdWlkIjoiMTAwMzIwMDEzNzY0MkNEQSIsImNhY2hla2V5IjoiMGguZnxtZW1iZXJzaGlwfDEwMDMyMDAxMzc2NDJjZGFAbGl2ZS5jb20iLCJzY3AiOiJteWZpbGVzLnJlYWQgYWxsZmlsZXMucmVhZCBteWZpbGVzLndyaXRlIGFsbGZpbGVzLndyaXRlIGFsbHNpdGVzLnJlYWQgYWxscHJvZmlsZXMucmVhZCIsInR0IjoiMiIsInVzZVBlcnNpc3RlbnRDb29raWUiOm51bGwsImlwYWRkciI6IjIwLjE5MC4xNDUuMTY5In0.VnZoOC9jQkQ4M1RsVmVvOWVsZWpUQVRBRVUwSEc0RnlBQm5TVkpVQWZmUT0&ApiVersion=2.0';

        const response = await axios.default.get(endpoint, options);
        console.log(response.headers);
        res.send(response.data);
    } catch (e) {
        res.statusCode(500);
    }


});

app.listen(3003, () => { console.log('App is running') });

// const options = yargs
//     .usage('Usage: --op <operation_name>')
//     .option('op', { alias: 'operation', describe: 'operation name', type: 'string', demandOption: true })
//     .argv;

// async function main() {
//     console.log(`You have selected: ${options.op}`);

//     switch (yargs.argv['op']) {
//         case 'getUsers':

//             try {
//                 // here we get an access token
//                 const authResponse = await auth.getToken(auth.tokenRequest);

//                 // call the web API with the access token
//                 const users = await fetch.callApi(auth.apiConfig.uri, authResponse.accessToken);

//                 // display result
//                 console.log(users);
//             } catch (error) {
//                 console.log(error);
//             }

//             break;
//         default:
//             console.log('Select a Graph operation first');
//             break;
//     }
// };

// main();