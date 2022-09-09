const axios = require('axios').default;
const config = require('../config.json');

module.exports = {
    fetchOne: async function(handle){
        if(handle.startsWith('$')) handle = handle.substring(1);
        const policyID = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';
        const assetName = Buffer.from(handle).toString('hex');
        const data = await axios.get(
            `https://cardano-mainnet.blockfrost.io/api/v0/assets/${policyID}${assetName}/addresses`,{headers: {
                project_id: config.blockfrost_api_key,
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });
        const onChainData = await axios.get(
        `https://cardano-mainnet.blockfrost.io/api/v0/assets/${policyID}${assetName}`,{headers: {
            project_id: config.blockfrost_api_key,
            'Content-Type': 'application/json'
        },
        validateStatus: () => true
        });
        return {
            data: data,
            onChainData: onChainData
        };
    }
}