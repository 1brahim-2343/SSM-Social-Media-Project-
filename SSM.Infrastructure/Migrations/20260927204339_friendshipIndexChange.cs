using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SSM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class friendshipIndexChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Friendships_User1Id_User2Id",
                table: "Friendships");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User1Id_User2Id_IsDeleted",
                table: "Friendships",
                columns: new[] { "User1Id", "User2Id", "IsDeleted" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Friendships_User1Id_User2Id_IsDeleted",
                table: "Friendships");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User1Id_User2Id",
                table: "Friendships",
                columns: new[] { "User1Id", "User2Id" },
                unique: true);
        }
    }
}
