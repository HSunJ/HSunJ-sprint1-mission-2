module.exports = {
  apps : [{
    name   : "pandamarket-be",       // 애플리케이션 이름 (PM2 list에서 보일 이름)
    script : "./dist/src/main.js",      // 실행할 스크립트 파일 (빌드된 JS 파일)
    instances: "1",               // CPU 코어 수만큼 클러스터 모드로 실행 ("max" 또는 숫자)
    exec_mode: "fork",           // 실행 모드: "fork" (기본값) 또는 "cluster"
    watch  : true,                  // 파일 변경 감지 시 자동 재시작 여부 (개발 시 유용, 운영 시엔 주의!)
    ignore_watch : ["node_modules", ".git"], // watch에서 무시할 폴더/파일
    max_memory_restart: '300M',     // 메모리가 이 값을 초과하면 재시작 (메모리 누수 방지)

    // 환경 변수 설정 (NODE_ENV=production으로 실행 시 적용됨)
    env_production: {
      ENVIROMENT: "PRODUCTION",
      PORT: 3000,
      DATABASE_URL: "postgresql://postgres:ishuer12@pandamarket-db.cvsgqosi4qzu.ap-northeast-2.rds.amazonaws.com:5432/pandamarket?schema=public"
    },
    // 환경 변수 설정 (NODE_ENV=development로 실행 시 적용됨)
    env_development: {
      ENVIROMENT: "DEVELOPMENT",
      PORT: 3000,
      DATABASE_URL: "postgresql://postgres:ishuer12@localhost:5432/pandamarket_dev?schema=public"
    }
  }]
};
