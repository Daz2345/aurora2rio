// live
if (process.env.NODE_ENV === "production") {
    Kadira.connect('dNvmdpgp66ZhzFGLy', 'fc1d56db-77f1-4d2d-9bcd-5956254cd2ba');
}

// dev
if (process.env.NODE_ENV === "development") {
    Kadira.connect('7XTfq2NPeYabmhNHW', 'f4dabd71-c78e-495c-8255-dbc8bb1026e3');
}