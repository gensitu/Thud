import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import Collection from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss'],
})
export class AddCollectionComponent implements OnInit {

  @Input() collection: Collection;

  public collectionName: string;
  public collectionDescription: string;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.collection) {
      this.collectionName = this.collection.name;
      this.collectionDescription = this.collection.description;
    }
  }

  async createCollection() {
    const loading = await this.loadingCtrl.create({
      message: 'Creating collection...',
    });
    await loading.present();
    const collection: Collection = {
      id: uuidv4(),
      name: this.collectionName,
      description: this.collectionDescription,
      feedIds: [],
    };
    await this.storageService.addCollection(collection);
    await loading.dismiss();
    this.modalCtrl.dismiss({
      collection: collection,
    });
  }

  async saveCollection() {
    const loading = await this.loadingCtrl.create({
      message: 'Saving collection...',
    });
    await loading.present();
    this.collection.name = this.collectionName;
    this.collection.description = this.collectionDescription;
    await this.storageService.updateCollection(this.collection);
    await loading.dismiss();
    this.modalCtrl.dismiss({
      collection: this.collection,
    });
  }

}