using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smis.Migrations
{
    /// <inheritdoc />
    public partial class AddAfatiIdToParaqitjaEProvimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AfatiId",
                table: "ParaqitjaEProvimit",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ParaqitjaEProvimit_AfatiId",
                table: "ParaqitjaEProvimit",
                column: "AfatiId");

            migrationBuilder.CreateIndex(
                name: "IX_AfatiRegjistrimit_FakultetiId",
                table: "AfatiRegjistrimit",
                column: "FakultetiId");

            migrationBuilder.AddForeignKey(
                name: "FK_AfatiRegjistrimit_Universiteti_FakultetiId",
                table: "AfatiRegjistrimit",
                column: "FakultetiId",
                principalTable: "Universiteti",
                principalColumn: "UniID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ParaqitjaEProvimit_AfatiProvimit_AfatiId",
                table: "ParaqitjaEProvimit",
                column: "AfatiId",
                principalTable: "AfatiProvimit",
                principalColumn: "AfatiProvimitId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AfatiRegjistrimit_Universiteti_FakultetiId",
                table: "AfatiRegjistrimit");

            migrationBuilder.DropForeignKey(
                name: "FK_ParaqitjaEProvimit_AfatiProvimit_AfatiId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.DropIndex(
                name: "IX_ParaqitjaEProvimit_AfatiId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.DropIndex(
                name: "IX_AfatiRegjistrimit_FakultetiId",
                table: "AfatiRegjistrimit");

            migrationBuilder.DropColumn(
                name: "AfatiId",
                table: "ParaqitjaEProvimit");
        }
    }
}
