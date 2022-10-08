'use strict'

import Fs from 'fs';
import Path from 'path';
import axios from 'axios';
import _ from 'lodash';
import * as util from 'util';


import mime from 'mime'; //will need to install with "npm i mime"

import * as  fs from 'fs';



export class DownloadImage {

    async downloadImage(url: string): Promise<string> {
        const dateNow = Date.now();
        const imageID = `${dateNow}.jpg`



        // const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
        try {
            const rootDir = process.cwd();
            const filePath = `${rootDir}/public/uploads/${imageID}`
            // const path = Path.resolve(__dirname, '../../public/uploads', imageID);
            const writer = Fs.createWriteStream(filePath)

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })

            response.data.pipe(writer)
            console.log('file path on local storage');

            console.log(filePath);

            // return imageID;
            // return path;

            return filePath;
        } catch (error) {

        }
    }


    // }
    // async uploadFileBinary(binary): Promise<string> {
    //     try {
    //         const uuid = new Date(Date.now()).getTime();
    //         const fileInfo = { name: uuid }
    //         const metas = {}
    //         const { optimize } = strapi.plugins.upload.services['image-manipulation'];
    //         const { buffer, info } = await optimize(binary);
    //         const formattedFile = await strapi.plugins.upload.services.upload.formatFileInfo(
    //             {

    //                 filename: uuid + '.png',
    //                 type: 'image/png',
    //                 size: binary.toString().length,
    //             },
    //             fileInfo,
    //             metas
    //         );
    //         const fileData = _.assign(formattedFile, info, {
    //             buffer,
    //         });
    //         const upload = await strapi.plugins.upload.services.upload.uploadFileAndPersist(fileData)
    //         return upload.id
    //     } catch (error) {
    //         console.log(error);

    //     }


    //}

    async uploadFileBinary(filepath): Promise<string> {
        const uuid = Date.now();
        const eadBuffer = await util.promisify(fs.readFile)(filepath);
        const fileInfo = { name: uuid }
        const metas = {}
        const { optimize } = strapi.plugins.upload.services['image-manipulation'];
        const { buffer, info } = await optimize(eadBuffer);
        const formattedFile = await strapi.plugins.upload.services.upload.formatFileInfo(
            {
                filename: uuid + '.jpg',
                type: 'image/jpg',
                size: eadBuffer.toString().length,
            },
            fileInfo,
            metas
        );
        const fileData = _.assign(formattedFile, info, {
            buffer,
        });
        console.log(fileData);

        const upload = await strapi.plugins.upload.services.upload.uploadFileAndPersist(fileData)
        return upload.id
    }


    async getImgPat(url: string): Promise<void> {

        //         const path = Path.resolve(__dirname, '../../public/uploads', `${dateNow}.jpg`);
        //         const writer = Fs.createWriteStream(path)

        //         const response = await axios({
        //             url,
        //             method: 'GET',
        //             responseType: 'stream'
        //         })

        //         response.data.pipe(writer)
        //         console.log(path);
        try {
            const imgUuId = await this.downloadImage(url);
            const rootDir = process.cwd();
            const fileName = 'url';
            const filePath = `${rootDir}/public/uploads/${imgUuId}`
            const stats = fs.statSync(filePath);

            //uploading it directly to upload services.
            await strapi.plugins.upload.services.upload.upload({

                data: {}, //mandatory declare the data(can be empty), otherwise it will give you an undefined error. This parameters will be used to relate the file with a collection.
                files: {
                    path: filePath,
                    name: fileName,
                    type: mime.getType(filePath), // mime type of the file
                    size: stats.size,
                },
            });
        } catch (error) {
            console.log(error);


        }
    }

}