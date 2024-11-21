'use strict';

const { Contract } = require('fabric-contract-api');

const accountObjType = "Account";

class BalanceTransfer extends Contract {
    async _accountExists(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(accountObjType, [id]);
        const accountBytes = await ctx.stub.getState(compositeKey);
        return accountBytes && accountBytes.length > 0;
    }

    async _getAccount(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(accountObjType, [id]);
        const accountBytes = await ctx.stub.getState(compositeKey);
        if (!accountBytes || accountBytes.length === 0) {
            throw new Error(`The account ${id} does not exist`);
        }
        return JSON.parse(accountBytes.toString());
    }

    async _putAccount(ctx, account) {
        const compositeKey = ctx.stub.createCompositeKey(accountObjType, [account.id]);
        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(account)));
    }

    _getTxCreatorUID(ctx) {
        return JSON.stringify({
            mspid: ctx.clientIdentity.getMSPID(),
            id: ctx.clientIdentity.getID()
        });
    }

    async initAccount(ctx, id, balance) {
        const accountBalance = parseFloat(balance);
        if (accountBalance < 0) {
            throw new Error(`Account balance cannot be negative`);
        }

        const account = {
            id: id,
            owner: this._getTxCreatorUID(ctx),
            balance: accountBalance
        };

        if (await this._accountExists(ctx, account.id)) {
            throw new Error(`The account ${account.id} already exists`);
        }

        await this._putAccount(ctx, account);
    }

    async setBalance(ctx, id, newBalance) {
        const account = await this._getAccount(ctx, id);

        const txCreator = this._getTxCreatorUID(ctx);
        if (account.owner !== txCreator) {
            throw new Error(`You do not have permission to update the balance for account ${id}`);
        }

        const updatedBalance = parseFloat(newBalance);
        if (updatedBalance < 0) {
            throw new Error('New balance cannot be negative');
        }

        account.balance = updatedBalance;
        await this._putAccount(ctx, account);
    }

    async transfer(ctx, idFrom, idTo, amount) {
        const fromAccount = await this._getAccount(ctx, idFrom);

        const txCreator = this._getTxCreatorUID(ctx);
        if (fromAccount.owner !== txCreator) {
            throw new Error(`You do not have permission to transfer funds from account ${idFrom}`);
        }

        const transferAmount = parseFloat(amount);
        if (transferAmount <= 0) {
            throw new Error('Transfer amount must be greater than zero');
        }

        if (fromAccount.balance < transferAmount) {
            throw new Error(`Insufficient funds in account ${idFrom}`);
        }

        const toAccount = await this._getAccount(ctx, idTo);

        fromAccount.balance -= transferAmount;
        toAccount.balance += transferAmount;

        await this._putAccount(ctx, fromAccount);
        await this._putAccount(ctx, toAccount);
    }

    async transferBalance(ctx, fromId, toId, amount) {
        const transferAmount = parseFloat(amount);
        if (transferAmount <= 0) {
            throw new Error('Transfer amount must be positive');
        }

        const fromAccount = await this._getAccount(ctx, fromId);
        const toAccount = await this._getAccount(ctx, toId);

        if (fromAccount.balance < transferAmount) {
            throw new Error('Insufficient balance in the source account');
        }

        fromAccount.balance -= transferAmount;
        toAccount.balance += transferAmount;

        await this._putAccount(ctx, fromAccount);
        await this._putAccount(ctx, toAccount);
    }

    async listAccounts(ctx) {
        const txCreator = this._getTxCreatorUID(ctx);

        const iterator = await ctx.stub.getStateByPartialCompositeKey("Account", []);

        const accounts = [];
        while (true) {
            const result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                const account = JSON.parse(result.value.value.toString());

                if (account.owner === txCreator) {
                    accounts.push(account);
                }
            }

            if (result.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(accounts);
    }
}

module.exports = BalanceTransfer;