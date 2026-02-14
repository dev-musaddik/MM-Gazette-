/**
 * Optimizes an image file by resizing and compressing it.
 * @param {File} file - The image file to optimize.
 * @param {number} maxWidth - Maximum width (default 1920).
 * @param {number} quality - JPEG quality 0-1 (default 0.8).
 * @returns {Promise<File>} - A promise that resolves with the optimized file.
 */
export const optimizeImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        if (!file.type.match(/image.*/)) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    // create a new file from the blob
                    const newFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(newFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
