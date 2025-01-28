import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-typewriter',
    template: '<h3 class="text-4xl font-bold zoomin animation-duration-800 animation-iteration-1">{{ displayedText }}</h3>',
    standalone: true,
    styles: [
        `
            span {
                border-right: 2px solid;
                white-space: nowrap;
                overflow: hidden;
            }
        `
    ]
})
export class TypewriterComponent implements OnInit {
    @Input() text: string = '';
    @Input() typingSpeed: number = 100;
    displayedText: string = '';

    ngOnInit() {
        this.type();
    }

    private type(index: number = 0) {
        if (index < this.text.length) {
            this.displayedText += this.text.charAt(index);
            setTimeout(() => this.type(index + 1), this.typingSpeed);
        }
    }
}
