import { TestBed } from "@angular/core/testing"
import { ApiService } from "./api.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ApiService", () => {
    let apiService: ApiService;
    let httpClient: HttpClient
    let httpTestingController: HttpTestingController
    beforeEach(() => {
        httpClient = jasmine.createSpyObj(['get', 'post'])
        TestBed.configureTestingModule({
            schemas:[
                NO_ERRORS_SCHEMA
              ],
            providers: [
                ApiService,
            ],
            imports: [
                HttpClientTestingModule
            ]
        })

        httpClient = TestBed.inject(HttpClient)
        httpTestingController = TestBed.inject(HttpTestingController)
        apiService = TestBed.inject(ApiService)
        apiService.user_id = 1
    })



    describe("User API Functionality", () => {
        describe("Authentication Functionality", () => {
            describe("Signup Method", () => {
                it("should return a 400 error message if the requested email is already taken", async () => {
                    let payload = {
                        contact: {
                            email: "naveen@gmail.com", password: 1234
                        }
                    }
                    apiService.signup(payload).then(res => {
                        expect(res.status).toEqual(400)
                    })
                    let request = httpTestingController.expectOne(apiService.user_url)
                    expect(request.request.method).toBe('GET')
                    request.flush([{ contact: { email: "naveen@gmail.com" } }])

                })

                it("should return a 200 success message if the requested email is not already taken", async () => {
                    let payload = {
                        contact: {
                            email: "nav@gmail.com", password: 1234
                        }
                    }
                    apiService.signup(payload).then(res => {
                        expect(res.status).toEqual(200)
                    })
                    let request = httpTestingController.expectOne(apiService.user_url)
                    expect(request.request.method).toBe('GET')
                    request.flush([])
                })
            })

            describe("Login Method", () => {
                it("should return a 200 status code on successful authentication", async () => {
                    apiService.login("naveen@gmail.com", "7605").then(res => {
                        expect(res.status).toEqual(200)
                    })
                    let request = httpTestingController.expectOne(apiService.user_url)
                    expect(request.request.method).toBe('GET')
                    request.flush([{ contact: { email: "naveen@gmail.com", password: "7605" } }])

                })

                it("should return a 400 status code on unsuccessful authentication", async () => {
                    apiService.login("naveen@gmail.com", "1234").then(res => {
                        expect(res.status).toEqual(404)
                    })
                    let request = httpTestingController.expectOne(apiService.user_url)
                    expect(request.request.method).toBe('GET')
                    request.flush([])
                })
            })
        })
        it("should return user details by ID", () => {
            apiService.get_user_detail_by_id().subscribe((res: any) => {
                expect(res.length).toBe(1)
            })

            let request = httpTestingController.expectOne(apiService.user_url + `?id=${apiService.user_id}`)
            request.flush([{
                user_id: 1,
                name: "nk"
            }])
        })

        it("should update the  user details by id", () => {
            let payload = {
                conatct: { name: "naveen" }
            }
            apiService.update_user_info(payload).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
            })
            let request = httpTestingController.expectOne(apiService.user_url + `/${apiService.user_id}`)
            expect(request.request.method).toEqual("PUT")
            request.flush(payload)
        })

    })

    describe("Account Api Functions", () => {
        it("should add account to the user", () => {
            let payload = {
                contact: { name: "naveen" },
                account_ids: [1]
            }
            apiService.add_account(payload).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
            })
            let request = httpTestingController.expectOne(apiService.account_url)
            expect(request.request.method).toEqual("POST")
            request.flush(payload)
        })

        it("should return account detail by id", () => {
            let payload = {
                "account_no": "233432432432",
                "cardholder_name": "naveen#hdfc",
                "bank": 1,
                "balance": 20000,
                "user_id": 1,
                "id": 1
            }
            apiService.get_account_by_id(1).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
            })
            let request = httpTestingController.expectOne(apiService.account_url + "/1")
            expect(request.request.method).toEqual("GET")
            request.flush(payload)
        })


        it("should return account detail by bank id", () => {
            let payload = [{
                "account_no": "233432432432",
                "cardholder_name": "naveen#hdfc",
                "bank": 1,
                "balance": 20000,
                "user_id": 1,
                "id": 1
            }]
            apiService.get_account_by_bankid(1).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
            })
            let request = httpTestingController.expectOne(apiService.account_url + `?bank=1&user_id=${apiService.user_id}`)
            expect(request.request.method).toEqual("GET")
            request.flush(payload)
        })

        it("should update the account detail based on account id", () => {
            let payload = [{
                "account_no": "233432432432",
                "cardholder_name": "naveen#hdfc",
                "bank": 1,
                "balance": 20000,
                "user_id": 1,
                "id": 1
            }]
            apiService.update_account_by_id(1, payload[0]).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
                expect(res.length).toBe(1)
            })
            let request = httpTestingController.expectOne(apiService.account_url + `/1`)
            expect(request.request.method).toEqual("PUT")
            request.flush(payload)
        })

    })

    describe("Bank Api Functionality", () => {
        it("should return all banks details", () => {
            let banks = [
                {
                    "id": 1,
                    "name": "HDFC",
                    "img": "../../../../../assets/banks/hdfc.png"
                },
                {
                    "id": 2,
                    "name": "State Bank of India (SBI)",
                    "img": "../../../../../assets/banks/sbi.png"
                },
            ]
            apiService.get_all_bank_accounts().subscribe((res: any) => {
                expect(res).not.toBeUndefined()
                expect(res.length).toEqual(banks.length)
            })
            let request = httpTestingController.expectOne(apiService.bank_url)
            expect(request.request.method).toEqual("GET")
            request.flush(banks)
        })

        it("should return  bank detail by id", () => {
            let banks =
            {
                "id": 1,
                "name": "HDFC",
                "img": "../../../../../assets/banks/hdfc.png"
            }
            apiService.get_bank_account_by_id(1).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
                expect(res).toBeDefined()
            })
            let request = httpTestingController.expectOne(apiService.bank_url + "?id=1")
            expect(request.request.method).toEqual("GET")
            request.flush(banks)
        })
    })


    describe("categories api", () => {
        it("should return income categories based on type", () => {
            let categories = [
                {
                    "id": 1,
                    "name": "Housing",
                    "type": 0
                },
                {
                    "id": 2,
                    "name": "Transportation",
                    "type": 0
                }
            ]
            apiService.get_all_categories_by_flagId(1).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
                expect(res).toBeDefined()
                expect(res.length).toEqual(categories.length)
            })
            let request = httpTestingController.expectOne(apiService.category_url + "?type=1")
            expect(request.request.method).toEqual("GET")
            request.flush(categories)
        })

        it("should return expense categories based on type", () => {
            let categories = [
                {
                    "id": 1,
                    "name": "Salary",
                    "type": 1
                },
                {
                    "id": 2,
                    "name": "Freelance",
                    "type": 1
                }
            ]
            apiService.get_all_categories_by_flagId(0).subscribe((res: any) => {
                expect(res).not.toBeUndefined()
                expect(res).toBeDefined()
                expect(res.length).toEqual(categories.length)
            })
            let request = httpTestingController.expectOne(apiService.category_url + "?type=0")
            expect(request.request.method).toEqual("GET")
            request.flush(categories)
        })
    })

    describe("Transaction Api",()=>{
        it("should add new transaction when calling the add_transaction method ",()=>{
            let payload:any=  {
                "amount": "25000",
                "category": "Salary",
                "desc": "monthly salary",
                "bank": 3,
                "flag": 1,
                "datetime": "2024-06-02T18:30:00.000Z",
                "user_id": 1,
              };
            apiService.add_transaction(payload).subscribe((res: any) => {
                expect(res.id).not.toBeUndefined()
                expect(res).toBeDefined()
            })
            let request = httpTestingController.expectOne(apiService.transaction_url)
            expect(request.request.method).toEqual("POST")
            payload.id=1
            request.flush(payload)
        })
        it("should return transaction details based on id ",()=>{
            let payload:any=  {
                "amount": "25000",
                "category": "Salary",
                "desc": "monthly salary",
                "bank": 3,
                "flag": 1,
                "datetime": "2024-06-02T18:30:00.000Z",
                "user_id": 1,
              };
            apiService.get_transaction_by_id(1).subscribe((res: any) => {

                expect(res).toBeDefined()
            })
            let request = httpTestingController.expectOne(apiService.transaction_url+"/1")
            expect(request.request.method).toEqual("GET")
            request.flush(payload)
        })
    })

})