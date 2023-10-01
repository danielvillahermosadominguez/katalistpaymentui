import { getLongestCommonPath, relativePathTo } from "../../src/js/utils/relativepath.js"
describe("The longest common path should", () => {
    it.each([
        ["", "@folder", "", "@folder"],
        ["@folder2/folder3", "@folder4/folder5/folder6", "", "@folder4/folder5/folder6"],
        ["@folder2/folder3/folder4", "@folder4/folder5", "", "@folder4/folder5"],
        ["@folder", "@folder", "@folder", ""],
        ["@folder1/folder2", "@folder1/folder2", "@folder1/folder2", ""],
        ["@", "@", "@", ""],
        ["@folder1/folder2/folder3", "@folder1/folder2", "@folder1/folder2", ""],
        ["@folder1/folder2/folder3", "@folder1/folder2/folder4", "@folder1/folder2", "folder4"],
        ["@folder1/folder3", "@folder1/folder2/folder4", "@folder1", "folder2/folder4"],
    ])
        ("'%s' combine to '%s' = ('%s', '%s')", (yourAbsPath, theOtherAbsPath, expectedPrefix, expectedRest) => {
            const { prefix, rest } = getLongestCommonPath(yourAbsPath, theOtherAbsPath)
            expect(prefix).toBe(expectedPrefix)
            expect(rest).toBe(expectedRest)
        })
})

describe("The relative path should", () => {
    describe("be assumed as ROOT when you use empty value", () => {
        it.each([
            ["", "@folder", "./folder"],
            ["", "@folder", "./folder"],
            ["", "@folder1/folder2", "./folder1/folder2"],
            ["", "", "./"],
            ["@folder", "", "../"],
        ])
            ("%s combine to %s = %s", (whereImRespectTheRoot, theRelativePath, expectedResult) => {
                const myRelativePath = relativePathTo(whereImRespectTheRoot, theRelativePath)
                expect(myRelativePath).toBe(expectedResult)
            })
    })

    describe("return the full absolute path when you are in the ROOT", () => {
        it.each([
            ["@", "@folder", "./folder"],
            ["@", "@folder", "./folder"],
            ["@", "@folder1/folder2", "./folder1/folder2"]
        ])
            ("%s combine to %s = %s", (whereImRespectTheRoot, theRelativePath, expectedResult) => {
                const myRelativePath = relativePathTo(whereImRespectTheRoot, theRelativePath)
                expect(myRelativePath).toBe(expectedResult)
            })
    })

    describe("ignore a / at the end", () => {
        it.each([
            ["@/", "@folder", "./folder"],
            ["@/", "@folder", "./folder"],
            ["@/", "@folder1/folder2", "./folder1/folder2"],
            ["@/", "@", "./"],
            ["@folder/", "@folder", "./"],
            ["@folder1/folder2/", "@folder1/folder2", "./"],
            ["@folder1/folder2/folder3/", "@folder1/folder2/folder3", "./"],
            ["@folder2/", "@folder", "../folder"],
            ["@folder2/folder2/", "@folder", "../../folder"],
            ["@folder2/folder2/folder4/", "@folder", "../../../folder"],
            ["@folder/folder2/folder4/", "@folder", "../../"],
            ["@folder1/", "@", "../"],
            ["@folder1/", "@/", "../"],
        ])
            ("%s combine to %s = %s", (whereImRespectTheRoot, theRelativePath, expectedResult) => {
                const myRelativePath = relativePathTo(whereImRespectTheRoot, theRelativePath)
                expect(myRelativePath).toBe(expectedResult)
            })
    })

    describe("return a ./ when you are in the same folder", () => {
        it.each([
            ["@", "@", "./"],
            ["@folder", "@folder", "./"],
            ["@folder1/folder2", "@folder1/folder2", "./"],
            ["@folder1/folder2/folder3", "@folder1/folder2/folder3", "./"],
        ])
            ("%s combine to %s = %s", (whereImRespectTheRoot, theRelativePath, expectedResult) => {
                const myRelativePath = relativePathTo(whereImRespectTheRoot, theRelativePath)
                expect(myRelativePath).toBe(expectedResult)
            })
    })

    describe("return several relative step backs when both are in different path", () => {
        it.each([
            ["@folder2", "@folder", "../folder"],
            ["@folder2/folder2", "@folder", "../../folder"],
            ["@folder2/folder2/folder4", "@folder", "../../../folder"],
            ["@folder/folder2/folder4", "@folder", "../../"],
            ["@folder1", "@", "../"],
            ["@folder1/folder2", "@", "../../"],
            ["@folder1", "@folder2", "../folder2"],
            ["@folder1/folder2", "@folder3", "../../folder3"],
            ["@folder1/folder2", "@folder3/folder4", "../../folder3/folder4"],
            ["@folder1/folder2/folder3", "@folder1/folder4/folder5", "../../folder4/folder5"],
            ["@folder1/folder2", "@folder1/folder2/folder3", "./folder3"],
            ["@folder1/folder2/folder3", "@folder1/folder2/folder3/folder5/folder6", "./folder5/folder6"],
            ["@folder1/folder2/folder3", "@../../folder", "../../../../../folder"],
            ["@../folder1/folder2/folder3", "@../../folder", "../../../../folder"],
        ])
            ("%s combine to %s = %s ", (whereImRespectTheRoot, theRelativePath, expectedResult) => {
                const myRelativePath = relativePathTo(whereImRespectTheRoot, theRelativePath)
                expect(myRelativePath).toBe(expectedResult)
            })
    })

    describe("allow to process paths with files", () => {
        it.each([
            ["@/", "@file1.js", "./file1.js"],
            ["@", "@file1.js", "./file1.js"],
            ["", "@file1.js", "./file1.js"],
            ["@folder2/", "@folder/file1.js", "../folder/file1.js"],
            ["@folder2", "@folder/file1.js", "../folder/file1.js"],
            ["@folder2/folder2", "@folder/file1.js", "../../folder/file1.js"],
            ["@folder2/folder2/folder4", "@folder/file1.js", "../../../folder/file1.js"],
            ["@folder/folder2/folder4", "@folder/file1.js", "../../file1.js"],
            ["@folder1", "@file1.js", "../file1.js"],
            ["@folder1/folder2", "@file1.js", "../../file1.js"],
            ["@folder1", "@folder2/file1.js", "../folder2/file1.js"],
            ["@folder1/folder2", "@folder3/file1.js", "../../folder3/file1.js"],
            ["@folder1/folder2", "@folder3/folder4/file1.js", "../../folder3/folder4/file1.js"],
            ["@folder1/folder2/folder3", "@folder1/folder4/folder5/file1.js", "../../folder4/folder5/file1.js"],
        ])
            ("%s combine to %s = %s ", (whereImRespectTheRoot, theRelativePath, expectedResult) => {
                const myRelativePath = relativePathTo(whereImRespectTheRoot, theRelativePath)
                expect(myRelativePath).toBe(expectedResult)
            })
    })
    describe("throw an exception if the format of the input is not correct", () => {
        it.each([
            ["not_at_sign/folder", "@file1.js"]            
        ])
            ("%s combine to %s throw exception", (whereImRespectTheRoot, theRelativePath) => {    
                let exception = null;
                try {
                    relativePathTo(whereImRespectTheRoot, theRelativePath)
                }  catch (e) {
                    exception = e
                }                                         

                expect(exception).not.toBe(null)                
            })
            
    })

    
})