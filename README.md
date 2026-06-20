# 📝 Premium Task Manager

A clean, modern, and high-performance **Task Manager** web application built with vanilla JavaScript, semantic HTML5, and advanced CSS features. This application helps users efficiently track, organize, and filter their daily tasks with smooth performance and full data persistence.

---

## ✨ Features

- **🌓 Dual Theme Support:** Premium Midnight Blue dark theme and clean light theme using HTML data-attributes.
- **💾 LocalStorage Persistence:** Tasks remain saved even after refreshing or closing the browser.
- **⚡ Performance Optimized:** Uses `DocumentFragment` to batch DOM updates, reducing layout reflows and repaints.
- **🔍 Advanced Filter Engine:** Real-time search by task title combined with category-based filtering.
- **🏷️ Category Badging:** Automatically assigns colored badges based on task categories (Work, Personal, Shopping).
- **🛠️ Full CRUD Operations:** Create, Read, Update (inline editing), and Delete tasks effortlessly.
- **📱 Fully Responsive Design:** Smooth grid-to-column shifting for optimal mobile and desktop experiences.

---

## 🛠️ Tech Stack Used

- **Frontend:** HTML5 (Semantic Structure)
- **Styling:** CSS3 (Custom Variables, Grid, Flexbox, Media Queries)
- **Scripting:** Vanilla JavaScript (ES6+, Event Delegation, LocalStorage, DocumentFragment)

---

## 💡 Key Architectural Highlights

### 🚀 DOM Performance Optimization
Instead of injecting elements individually into the live DOM tree (which causes heavy layout reflows), this project creates offline containers using `document.createDocumentFragment()`. All task items are bundled into these fragments first, leading to only **2 direct repaints** onto the DOM tree.

### 🎯 Event Delegation
Instead of attaching separate event listeners to every single task card's delete/complete/edit buttons, a single listener is attached to the parent containers (`pending-container` and `completed-container`). This saves browser memory and handles dynamically added elements seamlessly.

---

## 📂 Project Structure

```text
├── index.html       # Application layout and structure
├── style.css        # Midnight Blue & Light theme styles with Responsive Layouts
└── script.js       # Core application logic, filtering, and storage state
