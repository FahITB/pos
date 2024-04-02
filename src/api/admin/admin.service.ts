import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FireBaseService } from 'src/config/fire-base/fire-base.service';
import * as bcrypt from 'bcrypt';
import { LanguageService } from 'src/config/lang/language.service';
import { ResetPasswordDto, UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly firebaseService: FireBaseService,
    private readonly langService: LanguageService,
  ) { }

  //NOTE - create admin
  async create(
    createAdminDto: CreateAdminDto,
    // profileImage: Express.Multer.File,
  ) {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    await this.validateCreateAdmin(
      createAdminDto.username,
      createAdminDto.password,
    );
    // const imageUrl = await this.uploadProfileImage(profileImage);

    const hash = await this.hashPassword(createAdminDto.password);

    const data = {
      ...createAdminDto,
      // profileImage: imageUrl,
      password: hash,
    };

    await fireStore.add(data);

    return 'created successfully';
  }

  async findAll(): Promise<object[]> {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const finsAdmins = await fireStore.get();
    const admins = [];

    finsAdmins.forEach((doc) => {
      admins.push({ id: doc.id, ...doc.data(), password: undefined });
    });

    return admins;
  }

  async findOne(id: string): Promise<object> {
    const findAdmin = await this.findAdminById(id);

    const admin = {
      id: findAdmin.id,
      ...findAdmin.data(),
      password: undefined,
    };

    return admin;
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    profileImage: Express.Multer.File,
  ): Promise<string> {
    // connect to fireStore
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    //connect to storage
    const storage = this.firebaseService.getStorageInstance().bucket();

    const findAdmin = await this.findAdminById(id);

    let imageUrl;

    // delete old image
    if (findAdmin.data().profileImage && profileImage) {
      await storage.file(`admins/${findAdmin.data().profileImage}`).delete();
      imageUrl = await this.uploadProfileImage(profileImage);
    }

    const updateAdmin = {
      username: updateAdminDto.username
        ? updateAdminDto.username
        : findAdmin.data().username,
      role: updateAdminDto.role ? updateAdminDto.role : findAdmin.data().role,
      firstNameEN: updateAdminDto.firstNameEN
        ? updateAdminDto.firstNameEN
        : findAdmin.data().firstNameEN,
      firstNameLO: updateAdminDto.firstNameLO
        ? updateAdminDto.firstNameLO
        : findAdmin.data().firstNameLO,
      lastNameEN: updateAdminDto.lastNameEN
        ? updateAdminDto.lastNameEN
        : findAdmin.data().lastNameEN,
      lastNameLO: updateAdminDto.lastNameLO
        ? updateAdminDto.lastNameLO
        : findAdmin.data().lastNameLO,
      phone: updateAdminDto.phone
        ? updateAdminDto.phone
        : findAdmin.data().phone,
      email: updateAdminDto.email
        ? updateAdminDto.email
        : findAdmin.data().email,
      provinceEN: updateAdminDto.provinceEN
        ? updateAdminDto.provinceEN
        : findAdmin.data().provinceEN,
      provinceLO: updateAdminDto.provinceLO
        ? updateAdminDto.provinceLO
        : findAdmin.data().provinceLO,
      districtEN: updateAdminDto.districtEN
        ? updateAdminDto.districtEN
        : findAdmin.data().districtEN,
      districtLO: updateAdminDto.districtLO
        ? updateAdminDto.districtLO
        : findAdmin.data().districtLO,
      villageEN: updateAdminDto.villageEN
        ? updateAdminDto.villageEN
        : findAdmin.data().villageEN,
      villageLO: updateAdminDto.villageLO
        ? updateAdminDto.villageLO
        : findAdmin.data().villageLO,
      profileImage: imageUrl ? imageUrl : findAdmin.data().profileImage,
    };

    fireStore.doc(id).update({
      ...updateAdmin,
    });

    return 'updated successfully';
  }

  //NOTE - reset password
  async resetPassword(resetPassword: ResetPasswordDto) {
    if (!resetPassword.password) {
      throw new BadRequestException(this.langService.PASSWORD_IS_REQUIRED());
    }

    await this.findAdminById(resetPassword.id);

    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const hash = await this.hashPassword(resetPassword.password);

    await fireStore.doc(resetPassword.id).update({
      password: hash,
    });

    return 'reset successfully';
  }

  //NOTE - remove admin
  async remove(id: string): Promise<string> {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const storage = this.firebaseService.getStorageInstance().bucket();

    const findAdmin = await this.findAdminById(id);

    await fireStore.doc(id).delete();
    await storage.file(`admins/${findAdmin.data().profileImage}`).delete();

    return 'deleted successfully';
  }

  //NOTE - validate create admin
  async validateCreateAdmin(username: string, password: string) {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    if (!username) {
      throw new BadRequestException(this.langService.USERNAME_IS_REQUIRED());
    }

    if (!password) {
      throw new BadRequestException(this.langService.PASSWORD_IS_REQUIRED());
    }

    const findUsername = await fireStore
      .where('username', '==', username)
      .get();

    if (!findUsername.empty) {
      throw new BadRequestException(this.langService.USER_NOT_FOUND());
    }
  }

  //NOTE - upload profile image
  async uploadProfileImage(file: Express.Multer.File) {
    try {
      const storage = this.firebaseService.getStorageInstance().bucket();

      const fileName = `${Date.now()}-${file.originalname}`;
      const fileUpload = storage.file(`admins/${fileName}`);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (err) => reject(err));

        stream.on('finish', async () => {
          const imageUrl = `${fileName}`;
          resolve(imageUrl);
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new BadRequestException(this.langService.UPLOAD_IMAGE_FAILED());
    }
  }

  //NOTE - hash password
  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  //NOTE - find admin by id
  async findAdminById(id: string) {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const findAdmin = await fireStore.doc(id).get();

    if (!findAdmin.exists) {
      throw new BadRequestException(this.langService.USER_NOT_FOUND());
    }

    return findAdmin;
  }
}
