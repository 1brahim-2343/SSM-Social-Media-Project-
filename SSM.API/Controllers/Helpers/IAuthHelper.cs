using SMM.Application.Auth.DTOs;
using SMM.Domain.Entities;

namespace SSM.API.Controllers.Helpers
{
    public interface IAuthHelper
    {
        Task<AuthResponse> CreateAuthResponseAsync(AppUser user);
    }
}
