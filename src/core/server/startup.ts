import * as alt from 'alt-server';
import MySQL from './database/mysql';
import Account from './accounts/accounts';

import { IAccount } from './interface/IAccount';


alt.on('resourceStart', () => {
 
    let username = (0|Math.random()*9e6).toString(36);
    let account = new Account();

    account.exists('Cloud').then((data: IAccount) => {
        alt.log(`Checking if account ... exists.`);
        account.load(data, '123', '456').then(() => {
            alt.log(`Account ${data.username} (${data.id}) has been authorised.`);
        })
        .catch((err) => {
            alt.log(err);
        })
    })
    .catch((err) => {
        alt.log(JSON.stringify(err));
    });
});

alt.log(`Hello from alt:V Server.`);
