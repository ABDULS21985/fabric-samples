'use strict';

const { Contract } = require('fabric-contract-api');

class SimpleContract extends Contract {

    async put(ctx, key, value) {
        await ctx.stub.putState(key, Buffer.from(value));
    }

    async get(ctx, key) {
        const value = await ctx.stub.getState(key);
        if (!value || value.length === 0) {
            throw new Error(`The asset ${key} does not exist`);
        }

        return value.toString();
    }

    async del(ctx, key) {
        await ctx.stub.deleteState(key);
    }
    
}

module.exports = SimpleContract;