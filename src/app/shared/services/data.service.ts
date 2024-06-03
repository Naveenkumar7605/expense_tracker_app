import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import {DateTime} from "luxon"

@Injectable({
    providedIn: "root"
})
export class DataShareService {
    private user_id!: number;
    constructor(private api: ApiService) {
        this.user_id = Number(sessionStorage.getItem("user_id"))
    }


    async get_user_info() {
        this.user_id = Number(sessionStorage.getItem("user_id"))
        let user_dto: any = await this.api.get_user_detail_by_id().toPromise();
        let { account_ids, transaction_ids, contact } = user_dto[0];
        // let {datetime} = contact;
        
        let accounts_info: any[] = [];
        let transactions_info: any[] = [];
        for (let i = 0; i < account_ids.length; i++) {
            let item: any = account_ids[i];
            let account: any = await this.api.get_account_by_id(item).toPromise();
            let { account_no, balance, bank, cardholder_name } = account
            let bank_account: any = await this.api.get_bank_account_by_id(bank).toPromise();
            let { img, name } = bank_account[0]
            accounts_info[i] = {
                bank_name: name,
                bank_img: img,
                account_no,
                balance,
                bank,
                cardholder_name
            }
        }
        for (let i = 0; i < transaction_ids.length; i++) {
            let item = transaction_ids[i]
            let transaction: any = await this.api.get_transaction_by_id(item).toPromise()
            let { category, amount, flag, datetime, bank, desc, id } = transaction;
            // console.log(datetime)
        console.log(DateTime.fromISO(datetime).toFormat("yyyy-MM-dd"))
            let bank_account: any = await this.api.get_bank_account_by_id(bank).toPromise();
            let { img, name } = bank_account[0]
            transactions_info[i] = {
                id,
                bank_name: name,
                bank_img: img,
                category,
                amount,
                bank_id: bank,
                flag,
                datetime:DateTime.fromISO(datetime).toFormat("yyyy-MM-dd"),
                desc
            }

        }
        return {
            contact,
            account_ids,
            transaction_ids,
            accounts_info,
            transactions_info:transactions_info.reverse()
        }
    }



    public async linked_bank_accounts() {
        let { all_bank_accounts, linked_bank_account } = await this.slice_bank_accounts()
        return all_bank_accounts.filter((item: any) => linked_bank_account.includes(item.id))
    }

    private async slice_bank_accounts() {
        let linked_bank_account: any[] = []
        await this.api.get_user_detail_by_id().toPromise().then(async (res: any) => {
            for (let i = 0; i < res[0].account_ids.length; i++) {
                let account: any = await this.api.get_account_by_id(res[0].account_ids[i]).toPromise();
                linked_bank_account.push(account.bank)
            }
        })
        let all_bank_accounts: any = await this.api.get_all_bank_accounts().toPromise()
        return {
            linked_bank_account,
            all_bank_accounts
        }
    }

    public async unlinked_bank_accounts() {

        let { all_bank_accounts, linked_bank_account } = await this.slice_bank_accounts();
        return all_bank_accounts.filter((item: any) => !linked_bank_account.includes(item.id))

    }


    public async get_transaction_history(bank_id:number,star_dt:string,end_dt:string){
         console.log(star_dt,end_dt,bank_id)
         let {transactions_info} = await this.get_user_info()
         let filtered_dates = transactions_info.filter(item=>item.datetime>=star_dt && item.datetime<=end_dt && item.bank_id == bank_id);
         console.log(filtered_dates,"fil")
         return filtered_dates
    }
}