import { ClientService } from './../client.service';
import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit{

clients: Client[] = [];
formGroupClient : FormGroup;
isEditing: boolean = false;
  constructor (private clientService: ClientService,
              private formBuilder: FormBuilder)
              {
                this.formGroupClient = formBuilder.group({
                  id : [''], //dentro dos colchetes poderemos ter regras de validação
                  name : [''],
                  email : ['']
                });
              }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(){
    this.clientService.getClients().subscribe(
      {
      next: data => this.clients = data,
      error: (msg) => console.log("Erro ao chamar o endpoint " + msg)
    }

    )
  }

  save(){
    if(this.isEditing){

      this.clientService.update(this.formGroupClient.value).subscribe(
        {
          next: ()=>{
            this.loadClients();
            this.isEditing =false;
            this.formGroupClient.reset();
          }

        }
      )
    }
    else{

      this.clientService.save(this.formGroupClient.value).subscribe(
        {
          next: data => {
            this.clients.push(data);
            this.formGroupClient.reset();
          }
        }

      );

  }
  }




  remove(client : Client): void{
   this.clientService.remove(client).subscribe(
      {
        next : () => this.loadClients()
      })

  }
  edit(client : Client){
    this.formGroupClient.setValue(client);
    this.isEditing = true;
  }
}
