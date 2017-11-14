import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { MemoryOperation, MemoryService,
    MemoryCellType, MemoryOperationType } from '../memory.service';

class TextCellView {

    private _value: number;
    private _strValue: string;
    public address: number;

    constructor(address: number, initialValue: number = 0) {

        this._value = initialValue;
        this._strValue = String.fromCharCode(initialValue);
        this.address = address;

    }

    get value() {

        return this._value;

    }

    get strValue() {

        return this._strValue;

    }

    set value(newValue: number) {

        this._value = newValue;
        this._strValue = String.fromCharCode(newValue);

    }

}


@Component({
    selector: 'app-textual-display',
    templateUrl: './textual-display.component.html'
})
export class TextualDisplayComponent implements OnInit {

    public textCellViews: Array<TextCellView> = new Array<TextCellView>(16);

    private memoryOperationSource = new Subject<MemoryOperation>();

    private memoryOperationSource$: Observable<MemoryOperation>;

    constructor(private memoryService: MemoryService) {

        for (let i = 0; i < 16; i++) {

            this.textCellViews[i] = new TextCellView(i, 0);

        }

        this.memoryOperationSource$ = this.memoryOperationSource.asObservable();

        this.memoryOperationSource$.subscribe(
            (memoryOperation) => this.processMemoryOperation(memoryOperation)
        );

    }

    ngOnInit() {

        this.memoryService.addMemoryRegion('TextualDisplayRegion', 0x2F0, 0x2FF,
            MemoryCellType.READ_WRITE, 0, this.memoryOperationSource);

    }

    private operationWriteCell(address: number, value: number) {

        this.textCellViews[address - 0x2F0].value = value;

    }

    private processMemoryOperation(memoryOperation: MemoryOperation) {

        switch (memoryOperation.operationType) {

            case MemoryOperationType.STORE_BYTE:
                this.operationWriteCell(
                    memoryOperation.data.get('address'),
                    memoryOperation.data.get('value'));
                break;
            default:
                break;
        }

    }

}
