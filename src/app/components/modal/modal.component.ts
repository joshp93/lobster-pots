import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent {
    @Input() show: boolean = false;
    @Input() title: string = '';
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }
}
