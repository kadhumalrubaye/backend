'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadImage = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const util = __importStar(require("util"));
const mime_1 = __importDefault(require("mime")); //will need to install with "npm i mime"
const fs = __importStar(require("fs"));
class DownloadImage {
    async downloadImage(url) {
        const dateNow = Date.now();
        const imageID = `${dateNow}.jpg`;
        // const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
        try {
            const rootDir = process.cwd();
            const filePath = `${rootDir}/public/uploads/${imageID}`;
            // const path = Path.resolve(__dirname, '../../public/uploads', imageID);
            const writer = fs_1.default.createWriteStream(filePath);
            const response = await (0, axios_1.default)({
                url,
                method: 'GET',
                responseType: 'stream'
            });
            response.data.pipe(writer);
            console.log('file path on local storage');
            console.log(filePath);
            // return imageID;
            // return path;
            return filePath;
        }
        catch (error) {
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
    async uploadFileBinary(filepath) {
        const uuid = Date.now();
        const eadBuffer = await util.promisify(fs.readFile)(filepath);
        const fileInfo = { name: uuid };
        const metas = {};
        const { optimize } = strapi.plugins.upload.services['image-manipulation'];
        const { buffer, info } = await optimize(eadBuffer);
        const formattedFile = await strapi.plugins.upload.services.upload.formatFileInfo({
            filename: uuid + '.jpg',
            type: 'image/jpg',
            size: eadBuffer.toString().length,
        }, fileInfo, metas);
        const fileData = lodash_1.default.assign(formattedFile, info, {
            buffer,
        });
        console.log(fileData);
        const upload = await strapi.plugins.upload.services.upload.uploadFileAndPersist(fileData);
        return upload.id;
    }
    async getImgPat(url) {
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
            const filePath = `${rootDir}/public/uploads/${imgUuId}`;
            const stats = fs.statSync(filePath);
            //uploading it directly to upload services.
            await strapi.plugins.upload.services.upload.upload({
                data: {},
                files: {
                    path: filePath,
                    name: fileName,
                    type: mime_1.default.getType(filePath),
                    size: stats.size,
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.DownloadImage = DownloadImage;
