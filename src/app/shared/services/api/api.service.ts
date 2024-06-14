import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'


@Injectable({
    providedIn: "any"
})

export class ApiService {

    public user_url = "http://localhost:3000/users";
    public category_url = "http://localhost:3000/category";
    public account_url = "http://localhost:3000/accounts";
    public bank_url = "http://localhost:3000/banks";
    public transaction_url = "http://localhost:3000/transactions";

    public user_id!: number;

    constructor(private http: HttpClient) {
        this.user_id = Number(sessionStorage.getItem("user_id"))
    }

    


    //-----------------------------  authentication --------------------------------

    public async signup(payload: any) {

        let { email, password } = payload.contact
        const res: any = await this.http.get(this.user_url).toPromise()
        const check = res.filter((item: any) => item?.contact?.email == email);
        if (check.length > 0) {
            return {
                status: 400,
                data: "Already user Exists"
            };
        } else {
            await this.http.post(this.user_url, payload).toPromise()
            return {
                status: 200,
                data: "sucessfully created"
            };
        }
    }

    public async login(email: string, password: string) {
        const res: any = await this.http.get(this.user_url).toPromise()
        const check = res.filter((item: any) => item?.contact?.email == email && item?.contact?.password == password);
        if (res.length > 0 && check.length > 0) {
            sessionStorage.setItem("user_name", check[0].contact.user_name)
            return {
                status: 200,
                data: check[0]
            };
        } else {
            return {
                status: 404
            };
        }
    }


    //-----------------------------  user  --------------------------------

    public get_user_detail_by_id() {
        this.user_id = Number(sessionStorage.getItem("user_id"))
        return this.http.get(this.user_url + `?id=${this.user_id}`)
    }

    public update_user_info(payload: any) {
        return this.http.put(this.user_url + `/${this.user_id}`, payload)
    }

    public async update_user_contact_info(payload: any) {
        let user_info: any = await this.get_user_detail_by_id().toPromise();
        let exist_user_email = user_info[0].contact.email;
        let payload_email = payload.contact.email
        let resp: any;
        console.log(exist_user_email , payload_email , "pay")
        if (exist_user_email == payload_email) {
            this.update_user_info(payload).subscribe()
            resp = {
                status: 200,
                data: "sucessfully created"
            };
        } else {
            const res: any = await this.http.get(this.user_url).toPromise()
            console.log(res,"res")
            const check = res.filter((item: any) => item?.contact?.email == payload_email);
            console.log(check,"check")
            if (check.length > 0) {
                resp = {
                    status: 400,
                    data: "Already user Exists"
                };
            }else {
                console.log(payload,"calling")
                this.update_user_info(payload).subscribe()
                resp = {
                    status: 200,
                    data: "sucessfully created"
                };
            }

        }
        return resp
    }


    //-----------------------------  accounts --------------------------------
    public add_account(payload: any) {
        payload = { ...payload, user_id: this.user_id };
        return this.http.post(this.account_url, payload)

    }

    public get_account_by_id(account_id: number) {
        return this.http.get(this.account_url + `/${account_id}`)
    }


    public get_account_by_bankid(bank_id: number) {
        return this.http.get(this.account_url + `?bank=${bank_id}&user_id=${this.user_id}`)
    }

    public update_account_by_id(account_id: number, payload: any) {
        return this.http.put(this.account_url + `/${account_id}`, payload)
    }


    //-----------------------------  bank --------------------------------

    public get_all_bank_accounts() {
        return this.http.get(this.bank_url)
    }

    public get_bank_account_by_id(bank_id: any) {
        return this.http.get(this.bank_url + `?id=${bank_id}`)
    }




    // -----------------------------  catagories ----------------------------

    public get_all_categories_by_flagId(flag: number) {
        let params = new HttpParams().append("type", flag)
        return this.http.get(this.category_url + "?" + params)
    }



    // ---------------------------- transaction -------------------------------
    public add_transaction(payload: any) {
        payload = { ...payload, user_id: this.user_id };
        return this.http.post(this.transaction_url, payload)

    }

    public get_transaction_by_id(transaction_id: number) {
        return this.http.get(this.transaction_url + `/${transaction_id}`)
    }

}