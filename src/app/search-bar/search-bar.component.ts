import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TwitsService } from '../services/twits.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Output() dataFiltered = new EventEmitter();
  filter: string = '';
  constructor(private twitsService: TwitsService) { }

  ngOnInit() {
  }

  searchFilter(event) {
    
    if(this.filter) {
      this.twitsService.getTweetsFiltered(this.filter).subscribe(response => {
        if(response.data.statuses.length == 0) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast({
            title: 'There is no tweets for your search.'
          })
        }
        else {
          this.dataFiltered.next(response);
          window.scroll(0,0);
        }
      });
    }
  }

  keySearch(event) {
    if(event.key && event.key == "Enter") {
      this.searchFilter(event);
    }
  }
}
