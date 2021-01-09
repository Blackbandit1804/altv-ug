import mysql from 'mysql';

export default class MySQL {
    private static _instance: MySQL;

    connection: mysql.Connection;
    connected: boolean = false;

    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'altv'
        });

        this.connect();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public static query(query: string): any {
        return new Promise<Function>((resolve: Function, reject: Function) => {
            this.instance.connection.query(query, (err: mysql.MysqlError, results: mysql.queryCallback, fields: []) => {
                if(err) 
                    reject(err);
                else if(results.length == 0) 
                    reject('No records found.');
                else
                    resolve(results);
            });
        });
    }

    public static escape(id: any) {
        return this.instance.connection.escape(id);
    }

    private connect() {
        this.connection.connect((err: mysql.MysqlError) => {
            if(err) {
                console.log(err.message);
                return;
            }
            this.connected = true;
            console.log('MySQL connection established!');
        });
    }
}