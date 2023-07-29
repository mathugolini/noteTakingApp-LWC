import { LightningElement, api } from 'lwc';

export default class Notification extends LightningElement {

    showNotification = false 

    @api showToast() {
        this.showNotification = true
        setTimeout(()=> {
            this.showNotification = false
        },5000 )
    }
}
