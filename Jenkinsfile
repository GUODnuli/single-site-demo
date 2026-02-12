pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.prod.yml'
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
                    sh "cp \$ENV_FILE .env.production"
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
                sh "docker compose -f ${COMPOSE_FILE} --env-file .env.production up -d"
            }
        }

        stage('Verify') {
            steps {
                script {
                    sh 'sleep 30'
                    sh "docker compose -f ${COMPOSE_FILE} ps --format json | head -20"
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
            sh "docker compose -f ${COMPOSE_FILE} logs --tail=50 2>/dev/null || true"
        }
    }
}
