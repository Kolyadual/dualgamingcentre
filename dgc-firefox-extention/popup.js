document.getElementById("open-site").addEventListener("click", () => {
    browser.tabs.create({
        url: "https://kolyadual.github.io/dualgamingcentre"
    });
});
