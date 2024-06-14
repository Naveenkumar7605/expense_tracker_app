import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataShareService } from 'src/app/shared/services/data.service';
import { CustomeSpinnerService } from 'src/app/shared/services/spinner/custome-spinner.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor(private ds: DataShareService,private spinner:CustomeSpinnerService) { }
  public total_balance: number = 0
  transaction_data: any[] = [];
  clone_transaction_data: any[] = [];
  chartOptions: any ;
  canvas_visible: boolean = false;
  type_for_show: number = 2;
  default_select_btn: 1 | 2 = 1;

  ngOnInit(): void {

    this.ds.get_user_info().then((res: any) => {
      let { accounts_info, transactions_info } = res

      accounts_info.map((item: any) => {
        this.total_balance += +item.balance
      })

      this.transaction_data = transactions_info.map((item: any) => {
        return {
          ...item,
          date: new Date(item.datetime).toISOString().slice(0, 10)
        }
      })

      this.clone_transaction_data = Array.of(...this.transaction_data.map(item => {
        return {
          ...item,
          cat: 0
        }
      }))

      setTimeout(() => {
        this.drawCanva(0)
      });
    })
  }

  drawCanva(type: 0 | 1) {
    this.type_for_show = type
    this.canvas_visible = false;
    let filteredTransactions: any[] = [];
    let datasource: any[] = []
    this.transaction_data = this.clone_transaction_data.filter(item => item.flag == type)
    filteredTransactions = this.transaction_data.filter((transaction: any) => transaction.flag == type)
    const totalAmount = filteredTransactions.reduce((acc: any, transaction: any) => acc + parseFloat(transaction.amount), 0);
    const categoryPercentages = filteredTransactions.reduce((acc: { [x: string]: any; }, transaction: { category: any; amount: any; }) => {
      const { category, amount } = transaction;
      const percentage = (parseFloat(amount) / totalAmount) * 100;
      acc[category] = (acc[category] || 0) + percentage;
      return acc;
    }, {});


    Object.entries(categoryPercentages).forEach((value) => {
      datasource.push({
        y: parseInt(Number(value[1]).toFixed(2)),
        name: value[0],
      })
    })

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: datasource
      }]
    }
    this.spinner.open()
    setTimeout(() => {
      this.spinner.close()
      if (datasource.length > 0) {
        this.canvas_visible = true
      }
    }, 2000);
  }

  income() {
    this.form.controls['year'].patchValue("1")
    this.default_select_btn = 2
    this.drawCanva(1)
  }

  order_data() {
    this.transaction_data = this.transaction_data.reverse()
  }


  selectType(ev: any) {
    if (ev.value == 1) {
      this.transaction_data = this.clone_transaction_data.filter(item => item.flag == this.type_for_show).map(item=>{
        return {
          ...item,
          cat:0
        }
      })
    }
    if (ev.value == 2) {

      let category_data: any[] = []
      this.clone_transaction_data.map(item => {
        if (item.flag == this.type_for_show) {
          category_data.push(item.category)
        }
      })
      category_data = [... new Set(category_data)]
      let data: any[] = []
      for (let i = 0; i < category_data.length; i++) {
        let amount: number = 0
        this.clone_transaction_data.map((item: any) => {
          if (item.category == category_data[i] && item.flag == this.type_for_show) {
            amount += +item.amount
          }
        })
        data.push({
          category: category_data[i],
          amount
        })
      }
      this.transaction_data = data.map(item=>{
        return{
          ...item,
          cat:1
        }
      })

    }
  }

  expense() {
    this.form.controls['year'].patchValue("1")
    this.default_select_btn = 1
    this.drawCanva(0)
  }

  data: any;

  form = new FormGroup({
    year: new FormControl("1")
  }
  )


}
