import * as alt from 'alt-server';
import bcryptjs from 'bcryptjs';
import mysql from 'mysql';

import MySQL from '../database/mysql';

import { IAccount } from '../interface/IAccount';

export default class Account {
    private static _id: Number;
    private static _username: String;
    private static _admin: Number;

    public create(username: String, _hash: string, _hashEx: string) {
        let defaultAdmin = 0;
        let hash = String.prototype.concat(_hash, _hashEx);
        
        return new Promise((resolve, reject) => {
            bcryptjs.hash(hash, 8).then((hash) => {
                MySQL.query(`INSERT INTO accounts (username, admin, hash) VALUES ('${username}', ${defaultAdmin}, '${hash}')`).then((results: mysql.OkPacket) => {
                    resolve(`Account created: ${username}. ID: (${results.insertId})`);
                })
                .catch((err: String) => {
                    let response = {
                        error: err,
                        string: 'Failed to create an account for ${username}. Aborting!'
                    }
                    reject(response);
                });
            }).catch((err) => {
                let response = {
                    error: '',
                    string: `Failed to hash strings for account: ${username}.`
                };
                reject(response);
            });
        });
    }

    public save(account: IAccount) {
        MySQL.query(`UPDATE accounts SET username = '${account.username}', admin = ${account.admin} WHERE id = ${account.id}`).then((results: mysql.OkPacket) => {
            alt.log(`Account data stored for account ${account.username}. ID: (${account.id})`);
        })
        .catch((err: String) => {
            alt.log(`Failed to store data for account ${account.username}. ID: (${account.id})`);
            alt.log(err);
        });
    }

    public load(data: IAccount, hash: string, hashEx: string) {
        return new Promise<IAccount>((resolve: Function, reject: Function) => {
            let joinedHashes = String.prototype.concat(hash, hashEx);
            bcryptjs.compare(joinedHashes, data.hash, (err, success) => {
                if(success) {
                    resolve();
                } else {
                    reject(`Hashes do not match. Failed to authorize account ${data.username}. (${data.id})`)
                }
            });
        });
    }

    public exists(username: string) {
        return new Promise((resolve: Function, reject: Function) => {
            MySQL.query(`SELECT * FROM accounts WHERE username = '${username}' LIMIT 1`).then((results) => {
                resolve(results[0]);
            })
            .catch((err) => {
                let response = {
                    error: err,
                    string: `Account ${username} doesn't exist.`
                }
                reject(response);
            });
        });
    }
}