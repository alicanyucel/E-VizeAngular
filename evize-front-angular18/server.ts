import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import bootstrap from "./src/main.server";
import { environment } from "./src/environment/environment";
import axios from "axios";
import FormData from "form-data";

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");
  const indexHtml = join(serverDistFolder, "index.server.html");

  server.use((_, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), camera=(), microphone=()"
    );
    //res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    /*res.setHeader(
      "Content-Security-Policy",
      "default-src 'self';" +
        "connect-src 'self' http://10.10.10.22;" +
        "img-src 'self' http://10.10.10.22 data: blob:;" +
        "object-src 'self' http://10.10.10.22 blob:;" +
        "script-src 'self' 'unsafe-inline';" +
        "style-src 'self' 'unsafe-inline';"
    );*/


    /*res.setHeader(
      "Content-Security-Policy",
      "default-src 'self';" +
      "connect-src 'self' http://10.221.183.11:5000;" +
      "img-src 'self' http://10.221.183.11:5000 data: blob:;" +
      "object-src 'self' http://10.221.183.11:5000 blob:;" +
      "script-src 'self' 'unsafe-inline';" +
      "style-src 'self' 'unsafe-inline';"
    );*/

    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self';" +
      "connect-src 'self' http://liberyusevize.cogen.com.tr;" +
      "img-src 'self' http://liberyusevize.cogen.com.tr data: blob:;" +
      "object-src 'self' http://liberyusevize.cogen.com.tr blob:;" +
      "script-src 'self' 'unsafe-inline';" +
      "style-src 'self' 'unsafe-inline';"
    );

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.removeHeader("X-Powered-By");
    next();
  });

  const commonEngine = new CommonEngine();

  server.set("view engine", "html");
  server.set("views", browserDistFolder);

  server.get(
    "**",
    express.static(browserDistFolder, {
      maxAge: 1,
      index: "index.html",
    })
  );
  server.post(
    "/payment-result/*",
    express.urlencoded({ extended: true }),
    async (req, res: any) => {
      try {
        const formData = new FormData();
        for (const key in req.body) {
          formData.append(key, req.body[key]);
        }
        const fullUrl = req.originalUrl;
        const encrypted = fullUrl.split("/")[fullUrl.split("/").length - 2];
        const response = await axios({
          method: "post",
          url: `${environment.apiUrl}/paymentcreditcard/result/${encrypted}`,
          data: formData,
          headers: {
            ...formData.getHeaders(),
          },
        });

        if (response.data?.message == "00")
          res.redirect("/apply/payment/success");
        else res.redirect("/apply/payment/error");
      } catch (error: any) {
        res.redirect("/apply/payment/error");
      }
    }
  );

  server.get("**", (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env["PORT"] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
