using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using OfficeOpenXml;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly ExcelService _excelService;

    public UsersController(ILogger<UsersController> logger, ExcelService excelService)
    {
        _logger = logger;
        _excelService = excelService;
    }

    // GET: api/users
    [HttpGet]
    public ActionResult<IEnumerable<ExcelService.Employee>> GetUsers()
    {
        _logger.LogInformation("Retrieving all users.");
        var employees = _excelService.ReadExcelFile("/Users/admin/Desktop/InterviewTestData.xlsx");
        return Ok(employees);
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public ActionResult<ExcelService.Employee> GetUserById(string id)
    {
        var employees = _excelService.ReadExcelFile("/Users/admin/Desktop/InterviewTestData.xlsx");
        var user = employees.FirstOrDefault(e => e.Id == id);
        
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] ExcelService.Employee employee)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            string filePath = "/Users/admin/Desktop/InterviewTestData.xlsx";
            _excelService.AddEmployee(filePath, employee);
            // Load the existing Excel file using EPPlus
            using (ExcelPackage package = new ExcelPackage(new FileInfo(filePath)))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets.FirstOrDefault(); 

                // Find the next available row and write the new employee data to the Excel file
                int newRow = worksheet.Dimension.End.Row + 0;
                worksheet.Cells[newRow, 1].Value = employee.FirstName;
                worksheet.Cells[newRow, 2].Value = employee.LastName;
                worksheet.Cells[newRow, 3].Value = employee.JobTitle;
                worksheet.Cells[newRow, 4].Value = employee.Phone;
                worksheet.Cells[newRow, 5].Value = employee.Email;
                package.Save();
            }
            return Ok(employee);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error adding new employee: {0}", ex.Message);
            return StatusCode(500, "An error occurred while adding the new employee.");
        }
    }
}