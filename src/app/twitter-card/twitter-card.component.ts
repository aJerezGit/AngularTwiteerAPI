import { Component, OnInit } from '@angular/core';
import { TwitsService } from '../services/twits.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-twitter-card',
  templateUrl: './twitter-card.component.html',
  styleUrls: ['./twitter-card.component.scss']
})
export class TwitterCardComponent implements OnInit {
  // twits: any = { data : { statuses: null }};
  twits: any = [];
  metadata: any;
  notEmptyPost = true;
  notscrolly = true;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  constructor(private twitService: TwitsService,private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.twitService.getTweets().subscribe((data: any) => {
      this.twits = data.data.statuses;
      this.metadata = data.data.search_metadata;
    })
  }

  updateData(dataEvent) {
    this.twits = dataEvent.data.statuses;
    this.metadata = dataEvent.data.search_metadata;
  }

  onScroll() {
    if(this.notscrolly && this.notEmptyPost) {
      this.spinnerService.show();
      this.notscrolly = false;
      this.loadNextPost();      
    }
  }

  loadNextPost() {
    const nextResult = this.metadata.next_results;
    const actualSearch = this.metadata.query;
    this.twitService.getTweetsFiltered(`${actualSearch}${nextResult}`).subscribe((data: any) => {
      const nextTwits = data;
      this.spinnerService.hide();
      if(nextTwits.data.statuses.length === 0) {
        this.notEmptyPost = false;
      }
      this.twits = this.twits.concat(nextTwits.data.statuses);
      // console.log(this.metadata);
      this.metadata = nextTwits.data.search_metadata;
      // console.log(nextTwits.data.search_metadata);
      this.notscrolly = true;
    });
  }

  copyToClipBoard(element) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    const copiedTweet = `twitter.com/${this.twits[element].user.screen_name}/status/${this.twits[element].id_str}`;
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = copiedTweet;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    
    this.Toast({
      title: 'Tweet link copied to the clipboard.'
    })
  }

  favorite(element: string) {
    if(!localStorage.getItem(element)) {
      localStorage.setItem(element, 'liked');
      
      this.Toast({
        title: 'Saved to favorites.'
      })
    }
    else {
      localStorage.removeItem(element);
      this.Toast({
        title: 'Removed from favorites.'
      })
    }
  }

  public localStorageItem(id: string): string {
    return localStorage.getItem(id);
  }
}
