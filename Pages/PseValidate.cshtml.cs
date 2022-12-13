using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebPaymentGateway.Pages
{
    public class PseValidate : PageModel
    {
        private readonly ILogger<PseValidate> _logger;

        public PseValidate(ILogger<PseValidate> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}