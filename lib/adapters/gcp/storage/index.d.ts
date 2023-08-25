declare function _exports(): {
    listBuckets: () => Promise<string[]>;
    createBucket: (bucketName: any) => Promise<import("@google-cloud/storage/build/src/bucket").Bucket>;
    deleteBucket: (bucketName: any) => Promise<boolean>;
    listFiles: ({ bucketName, options }: {
        bucketName: any;
        options: any;
    }) => Promise<import("@google-cloud/storage/build/src/file").File[]>;
    saveFile: ({ bucketName, destFileName, contents }: {
        bucketName: any;
        destFileName: any;
        contents: any;
    }) => Promise<boolean>;
    deleteFile: ({ bucketName, fileName }: {
        bucketName: any;
        fileName: any;
    }) => Promise<boolean>;
    openFile: ({ bucketName, fileName }: {
        bucketName: any;
        fileName: any;
    }) => Promise<import("@google-cloud/storage").DownloadResponse>;
    renameFile: ({ bucketName, srcFileName, destFileName }: {
        bucketName: any;
        srcFileName: any;
        destFileName: any;
    }) => Promise<boolean>;
    copyFile: ({ srcBucketName, srcFileName, destBucketName, destFileName, }: {
        srcBucketName: any;
        srcFileName: any;
        destBucketName: any;
        destFileName: any;
    }) => Promise<boolean>;
};
export = _exports;
