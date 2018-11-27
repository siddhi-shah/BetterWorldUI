import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { UserService } from "../services/user.service";
import {BuildingComponent} from './../building/building.component';
import { NeedAuthGuard } from "../services/NeedAuthGuard";
import { Router } from '@angular/router';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  society;
  sid; bid;
  buildingList;
  flatList;
  buildingObj;
  @Input()
  modalName : string;

  //@Output()
  //eventEm = new EventEmitter();
  
  constructor(public _userService: UserService, public router: Router, public _needAuthGuard : NeedAuthGuard) { 
    
  }

  ngOnInit() {
    this._userService.getSociety().subscribe((data) => {
      this.society = data.dbResponse;
    },
      error => {
        console.log(error);
        this.society = error.message;
      });
  }

  onSocietyChange(societyid) {
    this.sid=societyid;
    this._userService.getBuilding(societyid).subscribe((data) => {
      this.buildingList = data.dbResponse;
    },
      error => {
        console.log(error);
        this.buildingList = error.message;
      });
  }

  onBuildingChange(buildingId) {
    this._userService.getFlatList(buildingId).subscribe((data) => {
      this.flatList = data.dbResponse;
    },
      error => {
        console.log(error);
        this.flatList = error.message;
      });
  }

  onSubmit(){
    console.log(this.modalName);
    if(this.modalName=='buildings')
      this.router.navigate(['societyManagment',this.sid,'buildings']);  
     else if(this.modalName=='flats')
     this.router.navigate(['societyManagment',this.sid,'buildings',this.bid,'flats']);
     else if(this.modalName=='owners') {   
        this.router.navigate(['societyManagment','owners']); 
     }    
  }
}
