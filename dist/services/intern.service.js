"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertDiscordData = exports.getAllInternBadges = exports.getInternBadgesListByCourseId = exports.getCohortScheduleByExplorerId = exports.getInternsList = exports.updateInternById = exports.deleteInternById = exports.getInternById = exports.createInterns = void 0;
const db_server_1 = require("@utils/db.server");
const createInterns = (interns) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = interns.map(intern => {
        return db_server_1.db.intern.upsert({
            where: { explorerId: intern.explorerId },
            update: Object.assign({}, intern),
            create: Object.assign({}, intern)
        });
    });
    yield Promise.all(promises);
    return { message: "Interns created and updated successfully!" };
});
exports.createInterns = createInterns;
const getInternById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const intern = yield db_server_1.db.intern.findUnique({ where: { id } });
    return intern;
});
exports.getInternById = getInternById;
const deleteInternById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedIntern = yield db_server_1.db.intern.delete({ where: { id } });
    return deletedIntern;
});
exports.deleteInternById = deleteInternById;
const updateInternById = (id, intern) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedIntern = yield db_server_1.db.intern.update({ where: { id }, data: intern });
    return updatedIntern;
});
exports.updateInternById = updateInternById;
const getInternsList = (filteringParams) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(filteringParams.cohort);
    const internsList = yield db_server_1.db.intern.findMany({
        where: {
            cohort: filteringParams.cohort,
            internCourseRole: {
                some: {
                    course: {
                        courseCipher: filteringParams.courseCipher,
                    },
                },
            },
        },
    });
    return internsList;
});
exports.getInternsList = getInternsList;
const getCohortScheduleByExplorerId = (explorerId) => __awaiter(void 0, void 0, void 0, function* () {
    const targetIntern = yield db_server_1.db.intern.findUnique({ where: { explorerId } });
    if (!targetIntern)
        return null;
    const cohortSchedule = db_server_1.db.cohortSchedule.findMany({
        where: {
            cohort: targetIntern.cohort,
        },
        orderBy: {
            eventDate: { sort: 'asc', nulls: 'last' },
        }
    });
    return cohortSchedule;
});
exports.getCohortScheduleByExplorerId = getCohortScheduleByExplorerId;
const getInternBadgesListByCourseId = (explorerId, courseCipher) => __awaiter(void 0, void 0, void 0, function* () {
    if (explorerId && courseCipher) {
        const intern = yield db_server_1.db.intern.findUnique({ where: { explorerId } });
        const course = yield db_server_1.db.course.findUnique({ where: { courseCipher } });
        if (intern && course) {
            const internCoursesBadges = yield db_server_1.db.eventInternBadge.findMany({
                where: {
                    internId: intern.id,
                    classEvent: {
                        courseId: course.id
                    }
                },
                include: {
                    badge: true
                }
            });
            if (!internCoursesBadges)
                return null;
            const badgesStatisticsByBadgeName = internCoursesBadges.reduce((accumulator, internBadge) => {
                const badgeName = internBadge.badge.name;
                accumulator[badgeName] = (accumulator[badgeName] || 0) + 1;
                return accumulator;
            }, {});
            return badgesStatisticsByBadgeName;
        }
        return null;
    }
    return null;
});
exports.getInternBadgesListByCourseId = getInternBadgesListByCourseId;
const getAllInternBadges = (explorerId) => __awaiter(void 0, void 0, void 0, function* () {
    const badges = {};
    const intern = yield db_server_1.db.intern.findUnique({
        where: {
            explorerId
        }
    });
    if (intern) {
        const { id } = intern;
        const internBadges = yield db_server_1.db.eventInternBadge.findMany({
            where: { internId: id },
            include: {
                badge: true
            }
        });
        internBadges.forEach(internBadge => {
            const { name } = internBadge.badge;
            if (badges[name])
                badges[name] += 1;
            else
                badges[name] = 1;
        });
        return badges;
    }
    return null;
});
exports.getAllInternBadges = getAllInternBadges;
const insertDiscordData = (discordData) => __awaiter(void 0, void 0, void 0, function* () {
    for (let element of discordData) {
        try {
            const { explorerId, discordId, discordNickname } = element;
            if (explorerId) {
                const intern = yield db_server_1.db.intern.findUnique({ where: { explorerId } });
                if (intern) {
                    yield db_server_1.db.intern.update({
                        where: {
                            explorerId
                        },
                        data: { discordId, discordNickname }
                    });
                }
                else {
                    continue;
                }
            }
            else if (!explorerId && discordNickname) {
                const intern = yield db_server_1.db.intern.findUnique({ where: { discordNickname } });
                if (intern) {
                    return yield db_server_1.db.intern.update({
                        where: {
                            discordNickname
                        },
                        data: { discordId }
                    });
                }
                return null;
            }
        }
        catch (e) {
            continue;
        }
    }
    return { message: "Discord data updated successfully!" };
});
exports.insertDiscordData = insertDiscordData;
// function transferDiscordNicknames () {
//     let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Internship");
//     let range = sheet.getRange("F:G");
//     let values = range.getValues().slice(2);
//     for (let i = 0; i < values.length; i += 100) {
//       let data = values.slice(i, i + 100);
//       let object = [];
//       data.forEach(intern => {
//         if (intern[1].length < 50) {
//           object.push({ explorerId: intern[0], discordNickname: intern[1], discordId: null })
//         }
//       })
//       let options = {
//         'method': "put",
//         'contentType': "application/json",
//         'payload': JSON.stringify({
//           data: object
//         })
//       }
//       UrlFetchApp.fetch(`http://52.57.170.54:5000/api/interns/discord/update`, options);
//     }
//   }
