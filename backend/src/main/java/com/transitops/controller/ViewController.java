package com.transitops.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/live-ops",
        "/task-automate",
        "/shipment-track",
        "/tracking",
        "/rent-co",
        "/acme-corp",
        "/bento-grid",
        "/vehicles",
        "/drivers",
        "/trips",
        "/maintenance"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
