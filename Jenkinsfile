pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.prod.yml'
        DEPLOY_DIR = '/opt/deploy/single-site-demo'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                withCredentials([file(credentialsId: 'single-site-demo-env', variable: 'ENV_FILE')]) {
                    sh "rm -f .env.production && cp \$ENV_FILE .env.production"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker compose -f ${COMPOSE_FILE} --env-file .env.production build --parallel"
            }
        }

        stage('Deploy') {
            steps {
                // Sync workspace to host-accessible path for bind mounts
                sh "rm -rf ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR} && cp -a . ${DEPLOY_DIR}/"
                sh "docker compose -p single-site-demo -f ${DEPLOY_DIR}/${COMPOSE_FILE} --env-file ${DEPLOY_DIR}/.env.production up -d"
            }
        }

        stage('Verify') {
            steps {
                script {
                    sh 'sleep 30'
                    sh "docker compose -p single-site-demo -f ${DEPLOY_DIR}/${COMPOSE_FILE} ps --format json | head -20"
                    retry(3) {
                        sleep 10
                        sh 'curl -sf http://localhost:3000/health || (echo "Health check failed" && exit 1)'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
            sh "docker compose -p single-site-demo -f ${DEPLOY_DIR}/${COMPOSE_FILE} logs --tail=50 2>/dev/null || true"
        }
    }
}
