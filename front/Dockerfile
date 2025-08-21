FROM node:22
WORKDIR /front

COPY . .
WORKDIR /front/next-app

# 依存関係をインストール
RUN npm install

# lightningcssの問題を解決するために、手動でコンパイル可能な環境を整備
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# lightningcssを強制的に再ビルド
RUN npm rebuild lightningcss --verbose || \
    (npm uninstall lightningcss && npm install --no-save lightningcss@latest) || \
    true

CMD ["npm", "run", "dev"]
EXPOSE 3000