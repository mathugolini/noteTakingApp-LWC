import { LightningElement, wire } from 'lwc';
import createNoteRecord from '@salesforce/apex/NoteTakingController.createNoteRecord'
import getNotes from '@salesforce/apex/NoteTakingController.getNotes'
const DEFAULT_NOTE_FORM = {
  Name:"",
  Note_Description__c:""
}
export default class NoteTakingApp extends LightningElement {
  showModal = false
  noteRecord = DEFAULT_NOTE_FORM
  noteList = []
  formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'indent',
    'align',
    'link',
    'clean',
    'table',
    'header',
    'color',
];

get isFormInvalid(){
  return !(this.noteRecord && this.noteRecord.Note_Description__c && this.noteRecord.Name)
}

  @wire(getNotes)
  noteListInfo({data, error}) {
    if (data) {
      console.log("data of notes", JSON.stringify(data))
      this.noteList = data.map(item=>{
        let formartedDate = new Date(item.LastModifiedDate).toDateString()
        return {...item, formartedDate}
      })
    } 
    if (error) {
      console.error("error in fetching", error)
      this.showToastMsg(error.message.body, 'error')
    }
  }

  createNoteHandler(){
    this.showModal = true
  }
  closeModalHandler(){
    this.showModal = false
    this.noteRecord = DEFAULT_NOTE_FORM
  }

  changeHandler(event){
    const {name, value} = event.target
    // const name = event.target.name
    // const value = event.target.value
    this.noteRecord={...this.noteRecord, [name]:value}
  }
  formSubmitHandler(event){
    event.preventDefault();
    console.log("this.noteRecord", JSON.stringify(this.noteRecord))
    this.createNote()
  }

  createNote(){
    createNoteRecord({title:this.noteRecord.Name, description:this.noteRecord.Note_Description__c}).then(()=>{
      this.showModal = false;
      this.showToastMsg("Note Created Successfully!!", 'success')
    }).catch(error=>{
      console.error("error", error.message.body)
      this.showToastMsg(error.message.body, 'error')
    })
  }

  showToastMsg(message, variant){
    const elem = this.template.querySelector('c-notification')
    if(elem){
      elem.showToast(message, variant)
    }
  }
}
