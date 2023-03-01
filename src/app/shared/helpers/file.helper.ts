export class FileHelper {

  static rename(original: File, name: string) {
    const extension = original.name.split('.').pop();
    return new File([original], `${name}.${extension}`, {
      type: original.type,
      lastModified: original.lastModified,
    });
  }

  static toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader?.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

}
