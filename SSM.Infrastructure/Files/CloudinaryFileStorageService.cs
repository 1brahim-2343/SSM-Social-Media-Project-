using Microsoft.AspNetCore.Http;
using SMM.Application.Files.Interfaces;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;


namespace SSM.Infrastructure.Files
{
    public class CloudinaryFileStorageService : IFileStorageService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryFileStorageService(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }
        public async Task DeleteAsync(string? fileUrl, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(fileUrl))
            {
                return;
            }

            var uri = new Uri(fileUrl);
            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);

            var resourceTypeIndex = Array.IndexOf(segments, "upload") - 1;
            var isVideo = segments[resourceTypeIndex] == "video";

            var publicIdWithExtension = string.Join('/', segments.Skip(resourceTypeIndex + 3));
            var publicId = publicIdWithExtension.Substring(0, publicIdWithExtension.LastIndexOf('.'));

            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = isVideo ? ResourceType.Video : ResourceType.Image
            };

            await _cloudinary.DestroyAsync(deleteParams);
        }

        public async Task<string> SaveImageAsync(IFormFile file, CancellationToken cancellationToken = default)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

            string imageUrl = uploadResult.SecureUrl.ToString();

            return imageUrl;

        }

        public async Task<string> SaveVideoAsync(IFormFile file, CancellationToken cancellationToken = default)
        {
            var uploadParams = new VideoUploadParams()
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

            return uploadResult.SecureUrl.ToString();
        }
    }
}
