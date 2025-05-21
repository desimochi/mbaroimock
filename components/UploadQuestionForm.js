'use client'
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Toast from './Toast';

export default  function UploadQuestionForm() {
  const [examDetails, setExamDetails] = useState(null);
  const [isCATExam, setIsCATExam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get('exam');
  const [errormessage, setErrormessage] = useState()
  const [formData, setFormData] = useState({
    question: '',
    topic: '',
    subject: '',
    level: 'simple',
    type: 'mcq',
    options: { a: '', b: '', c: '', d: '', answer: '' },
    para: '',
    solution: '',
    image:'',
    examName : query
  });
  useEffect(() => {
    setIsCATExam(query.toLowerCase().includes("cat"));
    const fetchExamDetails = async () => {
      try {

        if (!query) {
          setError("No exam specified in the URL.");
          return;
        }

        const res = await fetch(`/api/get-limit?exam=${query}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Something went wrong");
        } else {
          setExamDetails(data);
        }
      } catch (err) {
        setError("Failed to fetch exam details");
      } finally {
      }
    };

    fetchExamDetails();
  }, [formData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (['a', 'b', 'c', 'd', 'answer'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleimagechange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const maxSize = 40 * 1024; // 40KB in bytes
    if (file.size > maxSize) {
      setErrormessage('Image size should not exceed 40KB');
      setFormData((prev) => ({ ...prev, image: '' }));
      e.target.value = ''; // Clear file input
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
      setErrormessage(''); // clear any previous error
    };
    reader.readAsDataURL(file);
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({
        question: '',
        topic: '',
        subject: '',
        level: 'simple',
        type: 'mcq',
        options: { a: '', b: '', c: '', d: '', answer: '' },
        solution : '',
        para: '',
        examName : query
      });
      setLoading(false)
      setShowToast(true)
      setTimeout(()=>{
        setShowToast(false)
        window.location.reload();
      })
    } else if (response.status === 409) {
      setErrormessage("Question Already Exist in Database. Try Adding Other Question")
      setLoading(false)
      
    } else if (response.status === 410){
      setErrormessage("Limit of the Question Paper Completed You can not add more questions")
      setLoading(false)
    }else if (response.status === 411){
      setErrormessage("Exam Name is Missing You Have not selected the Exam Properly")
      setLoading(false)
    }
    else {
      alert('Error adding question');
      setLoading(false)
    }
  }  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <Toast message="Question saved successfully!"
        show={showToast}
        setShow={setShowToast}
        type="success" />
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Question - {examDetails?.uploadedquestion}/{examDetails?.limit}</h2>
        <p className='text-red-700 text-m' >{errormessage}</p>
        <form onSubmit={handleSubmit} className="space-y-3 grid grid-cols-2 items-center gap-4">
          <div>
            <label className="block text-gray-700 font-medium  ">Question</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium  ">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleimagechange}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium  ">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium  ">Subject</label>
            <select
  name="subject"
  value={formData.subject}
  onChange={handleInputChange}
  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
  required
>
  <option value="">Select a Subject</option>
  {isCATExam ? (
        <>
          <option value="Verbal Ability and Reading Comprehension">VARC</option>
          <option value="Interpretation and Logical Reasoning">DILR</option>
          <option value="Quantitative Aptitude">QA</option>
        </>
      ) : (
        <>
          <option value="Language Comprehension">Language Comprehension</option>
          <option value="Quantitative Techniques and Data Interpretation">
            Quantitative Techniques and Data Interpretation
          </option>
          <option value="Logical Reasoning">Logical Reasoning</option>
          <option value="Innovation & Entrepreneurship">Innovation & Entrepreneurship</option>
          <option value="General Awareness">General Awareness</option>
        </>
      )}
</select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium  ">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium  ">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="mcq">MCQ</option>
              <option value="para">Paragraph</option>
              <option value="tita">TITA</option>
            </select>
          </div>

          {formData.type === 'mcq' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium  ">Option A</label>
                <input
                  type="text"
                  name="a"
                  value={formData.options.a}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Option B</label>
                <input
                  type="text"
                  name="b"
                  value={formData.options.b}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Option C</label>
                <input
                  type="text"
                  name="c"
                  value={formData.options.c}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Option D</label>
                <input
                  type="text"
                  name="d"
                  value={formData.options.d}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Correct Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={formData.options.answer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {formData.type === 'para' && (
            <>
            <div>
                <label className="block text-gray-700 font-medium  ">Option A</label>
                <input
                  type="text"
                  name="a"
                  value={formData.options.a}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Option B</label>
                <input
                  type="text"
                  name="b"
                  value={formData.options.b}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Option C</label>
                <input
                  type="text"
                  name="c"
                  value={formData.options.c}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Option D</label>
                <input
                  type="text"
                  name="d"
                  value={formData.options.d}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium  ">Correct Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={formData.options.answer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
            <div>
              <label className="block text-gray-700 font-medium  ">Paragraph</label>
              <textarea
                name="para"
                value={formData.para}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              ></textarea>
            </div>
            </>
          )}
             <div>
              <label className="block text-gray-700 font-medium  ">Solution</label>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              ></textarea>
            </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
