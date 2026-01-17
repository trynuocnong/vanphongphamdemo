import gulp from 'gulp';
import zip from 'gulp-zip';

export const zipProject = () => {
    const zipName = `project_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
    return gulp.src([
        '**/*',
        '!node_modules/**',
        '!dist/**',
        '!.git/**',
        '!.local/**',
        '!.replit',
        '!*.zip',
        '!.antigravityignore'
    ], { dot: true })
        .pipe(zip(zipName))
        .pipe(gulp.dest('./'));
};

export default zipProject;
