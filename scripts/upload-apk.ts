import { S3Storage } from "coze-coding-dev-sdk";
import { readFileSync } from "fs";
import { join } from "path";

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

async function uploadApk() {
  try {
    const apkPath = join(process.cwd(), "android/app/build/outputs/apk/debug/app-debug.apk");
    const apkBuffer = readFileSync(apkPath);
    const fileName = "rebang-news/app-debug.apk";

    console.log("正在上传 APK 文件...");
    const fileKey = await storage.uploadFile({
      fileContent: apkBuffer,
      fileName: fileName,
      contentType: "application/vnd.android.package-archive",
    });

    console.log("APK 文件上传成功！", fileKey);

    // 生成签名 URL
    const downloadUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400 * 30, // 30天有效期
    });

    console.log("下载链接 (有效期30天):");
    console.log(downloadUrl);

    return { fileKey, downloadUrl };
  } catch (error) {
    console.error("上传失败:", error);
    throw error;
  }
}

uploadApk();
