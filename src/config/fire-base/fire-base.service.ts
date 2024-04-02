import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FireBaseService {
  private readonly storage: admin.storage.Storage;
  private readonly firestore: admin.firestore.Firestore;
  private static initialized = false; // Add this static flag

  constructor() {
    if (!FireBaseService.initialized) {
      const encoded = Buffer.from(process.env.PRIVATE_KEY);
      const privateKey = `-----BEGIN PRIVATE KEY-----\n${encoded}\n-----END PRIVATE KEY-----\n`;
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.PROJECT_ID,
          clientEmail: process.env.CLIENT_EMAIL,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.STORAGE_BUCKET_URL,
      });
      FireBaseService.initialized = true;
    }

    this.storage = admin.storage();
    this.firestore = admin.firestore();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }

  getFireStoreInstance(): admin.firestore.Firestore {
    return this.firestore;
  }
}
