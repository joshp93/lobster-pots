import { Component, OnInit } from '@angular/core';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  constructor(public progressService: ProgressService) { }

  ngOnInit(): void {
  }

}
