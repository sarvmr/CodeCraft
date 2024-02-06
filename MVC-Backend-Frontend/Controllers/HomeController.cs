// using System.Diagnostics;
// using Microsoft.AspNetCore.Mvc;
// using MVC_Backend_Frontend.Models;

// namespace MVC_Backend_Frontend.Controllers;

// public class HomeController : Controller
// {
//     private readonly ILogger<HomeController> _logger;

//     public HomeController(ILogger<HomeController> logger)
//     {
//         _logger = logger;
//     }

//     public IActionResult Index()
//     {
//         return View();
//     }

//     public IActionResult Privacy()
//     {
//         return View();
//     }

//     [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
//     public IActionResult Error()
//     {
//         return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
//     }
// }


using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MVC_Backend_Frontend.Models;

namespace MVC_Backend_Frontend.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [Authorize]
    public IActionResult Interactions()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

      // Help Page
    public IActionResult Help()
    {
        return View();
    }

    //Login Page
    public IActionResult Login()
    {
        return View();
    }

    //Logout Page
    public IActionResult Logout()
    {
        return View();
    }

    //Register Page
    public IActionResult Register()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Tutorial()
    {
        return View(new TutorialModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }}
