CREATE TABLE User (
	id INT AUTO_INCREMENT,
    nickname VARCHAR(10) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT (NOW()),
    updated_at DATETIME DEFAULT (NOW()),
    PRIMARY KEY(id)
);

CREATE TABLE Product (
	id INT AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    price INT NOT NULL,
    author INT,
    created_at DATETIME DEFAULT (NOW()),
    updated_at DATETIME DEFAULT (NOW()),
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES User(id)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

CREATE TABLE ProductComment (
	id INT AUTO_INCREMENT,
    product_id INT,
    author INT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT (NOW()),
    updated_at DATETIME DEFAULT (NOW()),
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES User(id)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY (product_id) REFERENCES Product(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ProductImage (
	id INT AUTO_INCREMENT,
	product_id INT NOT NULL,
    image TEXT,
	PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Tag (
	product_id INT,
    tag VARCHAR(10),
    PRIMARY KEY (product_id, tag),
	FOREIGN KEY (product_id) REFERENCES Product(id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE ProductLike (
    user_id INT,
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES User(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,	
    FOREIGN KEY (product_id) REFERENCES Product(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Article (
	id INT AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    author INT,
    created_at DATETIME DEFAULT (NOW()),
    updated_at DATETIME DEFAULT (NOW()),
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES User(id)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE ArticleComment (
	id INT AUTO_INCREMENT,
    article_id INT,
    author INT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT (NOW()),
    updated_at DATETIME DEFAULT (NOW()),
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES User(id)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY (article_id) REFERENCES Article(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ArticleImage (
	id INT AUTO_INCREMENT,
	article_id INT NOT NULL,
    image TEXT,
	PRIMARY KEY (id),
    FOREIGN KEY (article_id) REFERENCES Article(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ArticleLike (
    user_id INT,
    article_id INT,
    PRIMARY KEY (user_id, article_id),
    FOREIGN KEY (user_id) REFERENCES User(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,	
    FOREIGN KEY (article_id) REFERENCES Article(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);